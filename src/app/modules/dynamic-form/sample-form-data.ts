import { DynamicForm } from 'src/app/models/dynamic-form';

export const sampleForm: DynamicForm = {
  docId: 'sample',
  type: 'form',
  title: 'string',
  createdAt: new Date(),
  layout: {
    rows: [
      {
        width: 500,
        height: 50,
        columns: {
          fields: [
            {
              type: 'text',
              label: 'First Name',
              binding: 'firstname',
              attributes: {
                maxlength: 255,
                minlength: 1,
                placeholder: 'First Name'
              }
            },
            {
              type: 'text',
              label: 'Last Name',
              binding: 'lastname',
              attributes: {
                maxlength: 255,
                minlength: 1,
                placeholder: 'Last Name'
              }
            }
          ]
        }
      },
      {
        width: 500,
        height: 100,
        columns: {
          fields: [
            {
              type: 'textarea',
              label: 'About Me',
              binding: 'aboutme',
              attributes: {
                maxlength: 1024,
                minlength: 50,
                placeholder: 'Something nice about your self...'
              }
            }
          ]
        }
      },
      {
        width: 500,
        height: 50,
        columns: {
          fields: [
            {
              type: 'checkbox',
              label: 'Show Notifications',
              binding: 'notification_enabled',
              attributes: {
                default: true
              }
            },
            {
              type: 'select',
              label: 'Role',
              binding: 'role',
              attributes: {
                options: [
                  {
                    display: 'Admin',
                    value: 'admin'
                  },
                  {
                    display: 'User',
                    value: 'user'
                  }
                ]
              }
            }
          ]
        }
      },
      {
        width: 500,
        height: 100,
        columns: {
          fields: [
            {
              type: 'radio',
              label: 'Gender',
              binding: 'gender',
              attributes: {
                options: [
                  {
                    display: 'Male',
                    value: 'male'
                  },
                  {
                    display: 'Female',
                    value: 'female'
                  }
                ],
                default: 1
              }
            },
            {
              type: 'signature',
              label: 'Sign here',
              binding: 'signature',
              attributes: {
                width: 200,
                height: 100
              }
            }
          ]
        }
      },
      {
        width: 500,
        height: 50,
        columns: {
          fields: [
            {
              type: 'file',
              label: 'Resume',
              binding: 'resume'
            }
          ]
        }
      }
    ]
  }
};
