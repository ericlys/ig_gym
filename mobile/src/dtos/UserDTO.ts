export type UserDTO = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  permissions: {
    id: string;
    name: string;
    description: string;
  }[],
  roles: {
    id: string;
    name: string;
    description: string;
  }[]
};