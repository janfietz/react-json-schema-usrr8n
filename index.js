import React, { Component } from 'react';
import { render } from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from '@rjsf/core';

const schema = {
  definitions: {
    SerialDeviceSettings: {
      type: 'object',
      properties: {
        dev: {
          title: 'Device',
          type: 'string',
          enum: ['/dev/ttyS0', '/dev/ttyS1', '/dev/ttyS2', '/dev/ttyS3']
        },
        transferRate: {
          title: 'Transfer Rate',
          type: 'integer',
          enum: [
            300,
            600,
            1200,
            2400,
            4800,
            9600,
            14400,
            19200,
            38400,
            57600,
            115200,
            230400,
            460800
          ],
          default: 19200
        },
        protocol: {
          title: 'Protocol Setting',
          type: 'string',
          enum: ['8N1', '8E1', '8O1', '7N1'],
          default: '8N1'
        }
      }
    },
    ModbusTCPSettings: {
      type: 'object',
      properties: {
        Port: {
          type: 'number',
          default: 502
        },
        Address: {
          type: 'string',
          default: '192.168.0.1'
        },
        'Slave Node': {
          type: 'number',
          default: 1
        }
      }
    },
    SolorMaxComSettings: {
      type: 'object',
      properties: {
        Transport: {
          type: 'string',
          enum: ['TCP', 'Serial'],
          default: 'TCP'
        },
        DevAddress: {
          title: 'Device Address',
          type: 'integer',
          default: 1,
          minimum: 1,
          maximum: 249
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
                ComSettings: {
                  title: 'Communication Settings',
                  type: 'object',
                  properties: {
                    Port: {
                      type: 'number',
                      default: 502
                    },
                    Address: {
                      type: 'string',
                      default: '192.168.0.1'
                    }
                  }
                }
              }
            },
            {
              properties: {
                Transport: {
                  enum: ['Serial']
                },
                ComSettings: {
                  title: 'Communication Settings',
                  $ref: '#/definitions/SerialDeviceSettings'
                }
              }
            }
          ]
        }
      }
    },
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
        'Active power output %': {
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
                ComSetting: {
                  title: 'Communication Settings',
                  $ref: '#/definitions/ModbusTCPSettings'
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
    plant: {
      type: 'object',
      properties: {
        Type: {
          type: 'string',
          enum: ['ABB PVS 100', 'ABB Trio', 'Solarmax'],
          default: 'ABB PVS 100'
        }
      },
      dependencies: {
        Type: {
          oneOf: [
            {
              properties: {
                Type: {
                  enum: ['ABB PVS 100']
                },
                'Communication Settings': {
                  $ref: '#/definitions/ModbusTCPSettings'
                }
              }
            },
            {
              properties: {
                Type: {
                  enum: ['ABB Trio']
                },
                'Communication Settings': {
                  $ref: '#/definitions/ModbusTCPSettings'
                }
              }
            },
            {
              properties: {
                Type: {
                  enum: ['Solarmax']
                },
                'Communication Settings': {
                  $ref: '#/definitions/SolorMaxComSettings'
                }
              }
            }
          ]
        }
      }
    },
    setpoint: {
      type: 'object',
      properties: {
        Type: {
          type: 'string',
          enum: ['Modbus Digital', 'Modbus Analog', 'IEC104', 'Fixed'],
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
                Transport: {
                  $ref: '#/definitions/ModbusType'
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
            },
            {
              properties: {
                Type: {
                  enum: ['Fixed']
                },
                fixedValue: {
                  title: 'Fixed limitation value in %',
                  type: 'integer'
                },
                required: 'fixedValue'
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
    setpointList: {
      type: 'array',
      title: 'Setpoint',
      minItems: 0,
      items: {
        $ref: '#/definitions/setpoint'
      }
    },
    meterList: {
      type: 'array',
      title: 'Metering',
      minItems: 0,
      items: {
        type: 'string',
        enum: ['Meter Type 1', 'Meter Type 2', 'Meter Type 3'],
        default: 'Meter Type 1'
      }
    },
    controlledEntityList: {
      type: 'array',
      title: 'Plant devices',
      minItems: 0,
      items: {
        $ref: '#/definitions/plant'
      }
    },
    controlLogic: {
      title: 'Control',
      type: 'object',
      properties: {
        ramp: {
          title: 'Ramp value in %',
          type: 'integer',
          default: 10,
          minimum: 1,
          maximum: 100
        }
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
