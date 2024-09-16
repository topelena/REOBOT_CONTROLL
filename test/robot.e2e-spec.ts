import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { RobotService } from '../src/robot/robot.service';

describe('RobotController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.get(RobotService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return the correct final position and orientation (201 status)', async () => {
    const navigateDto = {
      roomSize: [5, 5],
      startPosition: { x: 1, y: 2, orientation: 'N' },
      commands: 'F',
    };

    const response = await request(app.getHttpServer())
      .post('/robot/navigate')
      .send(navigateDto)
      .expect(201);

    expect(response.body).toEqual({
      report: { x: 1, y: 3, orientation: 'N' },
    });
  });

  it('should return a 400 error for invalid room size', async () => {
    const navigateDto = {
      roomSize: [0, 0],
      startPosition: { x: 1, y: 2, orientation: 'N' },
      commands: 'LFFRFRFRFF',
    };

    const response = await request(app.getHttpServer())
      .post('/robot/navigate')
      .send(navigateDto)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toEqual({
      statusCode: HttpStatus.BAD_REQUEST,
      message: `Bad Request: [\"Room dimensions must be greater than or equal to 1\"].`,
    });
  });

  it('should return a 403 error if the robot goes out of bounds', async () => {
    const navigateDto = {
      roomSize: [5, 5],
      startPosition: { x: 1, y: 2, orientation: 'N' },
      commands: 'FFFFFFFFF',
    };

    const response = await request(app.getHttpServer())
      .post('/robot/navigate')
      .send(navigateDto)
      .expect(HttpStatus.FORBIDDEN);

    expect(response.body).toEqual({
      statusCode: HttpStatus.FORBIDDEN,
      message: 'Out of bounds at 1 5',
    });
  });

  it('should return a 400 error for invalid command input', async () => {
    const navigateDto = {
      roomSize: [5, 5],
      startPosition: { x: 1, y: 2, orientation: 'N' },
      commands: 'LFFRFX',
    };

    const response = await request(app.getHttpServer())
      .post('/robot/navigate')
      .send(navigateDto);

    expect(response.body).toEqual({
      statusCode: HttpStatus.BAD_REQUEST,
      message: `Bad Request: [\"Commands must only contain L, F, or R\"].`,
    });
  });
});
