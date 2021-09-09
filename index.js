import React, { Component } from 'react';
import { render } from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from '@rjsf/core';

const schema = {
  definitions: {
    DigitalMatrixRow: {
      type: 'object',
      properties: {
        Channel: {
          type: 'number',
          enum: [1, 2, 3, 4, 5]
        },
        Value: {
          type: 'number'
        }
      }
    },
    DigitalMatrix: {
      type: 'object',
      properties: {
        Value1: {
          $ref: '#/definitions/DigitalMatrixRow'
        },
        Value2: {
          $ref: '#/definitions/DigitalMatrixRow'
        },
        Value3: {
          $ref: '#/definitions/DigitalMatrixRow'
        },
        Value4: {
          $ref: '#/definitions/DigitalMatrixRow'
        },
        Value5: {
          $ref: '#/definitions/DigitalMatrixRow'
        }
      }
    },
    ModbusType: {
      type: 'object',
      properties: {
        Transport: {
          type: 'string',
          enum: ['TCP', 'RTU'],
          default: 'TCP'
        }
      },
      dependencies: {
        Transport: {
          oneOf: [
            {
              properties: {
                Transport: {
                  enum: ['TCP']
                },
                Port: {
                  type: 'number',
                  default: 502
                },
                Address: {
                  type: 'string',
                  default: '192.168.0.1'
                }
              }
            },
            {
              properties: {
                Transport: {
                  enum: ['RTU']
                },
                Device: {
                  type: 'string',
                  examples: [
                    '/dev/ttyS0',
                    '/dev/ttyS1',
                    '/dev/ttyS2',
                    '/dev/ttyS3'
                  ]
                }
              }
            }
          ]
        }
      }
    },
    person: {
      type: 'object',
      properties: {
        Type: {
          type: 'string',
          enum: ['Modbus Digital', 'Modbus Analog', 'IEC104'],
          default: 'Modbus Digital'
        }
      },
      dependencies: {
        Type: {
          oneOf: [
            {
              properties: {
                Type: {
                  enum: ['Modbus Digital']
                },
                Transport: {
                  $ref: '#/definitions/ModbusType'
                },
                Matrix: {
                  $ref: '#/definitions/DigitalMatrix'
                }
              }
            },
            {
              properties: {
                Type: {
                  enum: ['Modbus Analog']
                },
                Port: {
                  type: 'number',
                  default: 502
                },
                Address: {
                  type: 'string',
                  default: '192.168.0.1'
                }
              },
              required: ['Address']
            },
            {
              properties: {
                Type: {
                  enum: ['IEC104']
                },
                ASDU: {
                  type: 'number',
                  default: 1
                },
                Port: {
                  type: 'number',
                  default: 2404
                },
                Address: {
                  type: 'string',
                  default: '192.168.0.1'
                }
              },
              required: ['Address']
            }
          ]
        }
      }
    }
  },
  type: 'object',
  properties: {
    minItemsList: {
      type: 'array',
      title: 'Setpoint Sources',
      minItems: 0,
      items: {
        $ref: '#/definitions/person'
      }
    }
  }
};

const log = type => console.log.bind(console, type);

render(
  <Form
    schema={schema}
    onChange={log('changed')}
    onSubmit={log('submitted')}
    onError={log('errors')}
  />,
  document.getElementById('root')
);
