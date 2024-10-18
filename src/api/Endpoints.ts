import axios from 'axios';

interface User {
  id: string;
  name: string;
  avatar?: string;
}


interface NewUser {
  name: string;
  avatar: string;
}


interface UpdateUser extends NewUser {
  id: string;
}
 

const apiUrl = 'https://6710c22fa85f4164ef2f2bbd.mockapi.io/kullaniciler';

// Kullanıcıları getir
export const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get<User[]>(apiUrl);
  return response.data;
};

// Kullanıcı ekle
export const addUser = async (newUser: NewUser, users: User[], setUsers: (users: User[]) => void, setNewUser: (newUser: NewUser) => void): Promise<void> => {
  const response = await axios.post<User>(apiUrl, newUser);
  setUsers([...users, response.data]);
  setNewUser({ name: '', avatar: '' });
};

// Kullanıcı güncelle
export const editUser = async (id: string, updateUser: UpdateUser, users: User[], setUsers: (users: User[]) => void, setUpdateUser: (updateUser: UpdateUser) => void, setIsEdit: (isEdit: boolean) => void): Promise<void> => {
  const response = await axios.put<User>(`${apiUrl}/${id}`, updateUser);
  setUsers(users.map(user => (user.id === id ? response.data : user)));
  setUpdateUser({ id: '', name: '', avatar: '' });
  setIsEdit(false);
};

// Kullanıcı sil
export const deleteUser = async (id: string, users: User[], setUsers: (users: User[]) => void): Promise<void> => {
  await axios.delete(`${apiUrl}/${id}`);
  setUsers(users.filter(user => user.id !== id));
};

 

 

