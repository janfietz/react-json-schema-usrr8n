import React, { Component } from 'react';
import { render } from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from '@rjsf/core';

const schema = {
  definitions: {
    DigitalMatrixRow: {
      type: 'object',
      properties: {
        DI_1: {
          type: 'boolean'
        },
        DI_2: {
          type: 'boolean'
        },
        DI_3: {
          type: 'boolean'
        },
        DI_4: {
          type: 'boolean'
        },
        DI_5: {
          type: 'boolean'
        },
        Value: {
          type: 'number'
        }
      }
    },
    DigitalMatrix: {
      type: 'array',
      minItems: 0,
      items: {
        title: 'Step',
        $ref: '#/definitions/DigitalMatrixRow'
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
                'Setpoint DI Settings': {
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
class FormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { formData: null };
  }

  onFormDataChanged = ({ formData = '' }) =>
    console.log(JSON.stringify(formData));

  render() {
    return (
      <Form
        schema={schema}
        onChange={this.onFormDataChanged}
        onSubmit={log('submitted')}
        onError={log('errors')}
      />
    );
  }
}

render(<FormComponent />, document.getElementById('root'));
