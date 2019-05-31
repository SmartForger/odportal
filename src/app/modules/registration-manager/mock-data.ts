export interface UserDetails {
  id: string;
  online: string;
  username: string;
  fullname: string;
  email: string;
  created: Date;
  role: string;
  status: string;
}

export const users: UserDetails[] = [
  {
    id: '1',
    online: 'online',
    username: 'schambers11',
    fullname: 'Steven Chambers',
    email: 'steven.chambers@ultimateknowledge.com',
    created: new Date(2019, 4, 20),
    role: 'General User',
    status: 'Pending'
  },
  {
    id: '2',
    online: 'online',
    username: 'afagin',
    fullname: 'Andrew Fagin',
    email: 'andrewfagin912@gmail.com',
    created: new Date(2019, 4, 20),
    role: 'General User',
    status: 'Pending'
  },
  {
    id: '3',
    online: 'online',
    username: 'tlarson',
    fullname: 'Travis Larson',
    email: 'tlarson@ultimateknowledge.com',
    created: new Date(2019, 4, 19),
    role: 'General User',
    status: 'Pending'
  },
  {
    id: '4',
    online: 'online',
    username: 'scottwells',
    fullname: 'Scott Wells',
    email: 'scottawells@ultimateknowledge.com',
    created: new Date(2019, 4, 19),
    role: 'General User',
    status: 'Pending'
  },
  {
    id: '5',
    online: 'online',
    username: 'smredman',
    fullname: 'Steven Redman',
    email: 'sredman@ultimateknowledge.com',
    created: new Date(2019, 4, 19),
    role: 'General User',
    status: 'Pending'
  }
];

export const emptyUser = {
  id: '',
  online: '',
  username: '',
  fullname: '',
  email: '',
  created: null,
  role: '',
  status: ''
};
