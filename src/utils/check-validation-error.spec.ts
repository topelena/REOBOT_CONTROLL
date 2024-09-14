import { ValidationError } from 'class-validator';

import { checkValidationErrors } from './check-validation-errors';

describe('[checkValidationErrors]', () => {
  const err: ValidationError[] = [
    {
      target: { receiptLanguage: 'en', userLanguage: 'en' },
      value: undefined,
      property: 'customerId',
      children: [],
      constraints: {
        isNotEmpty: 'customerId should not be empty',
        isString: 'customerId must be a string',
      },
    },
  ];
  it('should return array of strings', async () => {
    const result = checkValidationErrors(err);
    expect(result).toStrictEqual([
      'customerId should not be empty',
      'customerId must be a string',
    ]);
  });

  it('should return undefined', async () => {
    const result = checkValidationErrors([]);
    expect(result).toStrictEqual(undefined);
  });

  it('should return array of strings', async () => {
    const errors = [
      {
        target: {
          email: 123,
          phoneNumber: 123,
          socialSecurityNumber: 123,
          cardToken: 123,
          displayName: 123,
          birthdate: 123,
          address: {
            type: 123,
            streetAddress: 123,
            city: 123,
            postalCode: 123,
            country: 123,
            region: 123,
          },
          gender: 123,
          currency: 123,
          businessUnitId: 123,
          channelChoices: [
            {
              channelId: 123,
              optIn: 123,
            },
          ],
        },
        value: [
          {
            channelId: 123,
            optIn: 123,
          },
        ],
        property: 'channelChoices',
        children: [
          {
            target: [
              {
                channelId: 123,
                optIn: 123,
              },
            ],
            value: {
              channelId: 123,
              optIn: 123,
            },
            property: '0',
            children: [
              {
                target: {
                  channelId: 123,
                  optIn: 123,
                },
                value: 123,
                property: 'channelId',
                children: [],
                constraints: {
                  isString: 'channelId must be a string',
                },
              },
              {
                target: {
                  channelId: 123,
                  optIn: 123,
                },
                value: 123,
                property: 'optIn',
                children: [],
                constraints: {
                  isBoolean: 'optIn must be a boolean value',
                },
              },
            ],
          },
        ],
      },
      {
        target: {
          email: 123,
          phoneNumber: 123,
          socialSecurityNumber: 123,
          cardToken: 123,
          displayName: 123,
          birthdate: 123,
          address: {
            type: 123,
            streetAddress: 123,
            city: 123,
            postalCode: 123,
            country: 123,
            region: 123,
          },
          gender: 123,
          currency: 123,
          businessUnitId: 123,
          channelChoices: [
            {
              channelId: 123,
              optIn: 123,
            },
          ],
        },
        value: 123,
        property: 'email',
        children: [],
        constraints: {
          isString: 'email must be a string',
        },
      },
    ];
    const result = checkValidationErrors(errors);
    expect(result).toStrictEqual([
      'channelChoices.0.channelId must be a string',
      'channelChoices.0.optIn must be a boolean value',
      'email must be a string',
    ]);
  });
});

