import axios from 'axios';
import './App.css';
import React, { useState, useEffect } from 'react';

// Kullanıcı tipi tanımlaması
interface User {
  id: string;
  name: string;
  avatar?: string;

}

// Yeni kullanıcı tipi tanımlaması
interface NewUser {
  name: string;
  avatar: string;
}

// Güncellenen kullanıcı tipi tanımlaması
interface UpdateUser extends NewUser {
  id: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<NewUser>({ name: '', avatar: '' });
  const [updateUser, setUpdateUser] = useState<UpdateUser>({ id: '', name: '', avatar: '' });
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const apiUrl = 'https://6710c22fa85f4164ef2f2bbd.mockapi.io/kullaniciler';

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>(apiUrl);
      setUsers(response.data);
    } catch (error) {
      console.error('Kullanıcıları getirirken hata oluştu:', error);
    }
  };

  const addUser = async () => {
    try {
      const response = await axios.post<User>(apiUrl, newUser);
      setUsers([...users, response.data]);
      setNewUser({ name: '', avatar: '' });
    } catch (error) {
      console.error('Kullanıcı eklerken hata oluştu:', error);
    }
  };

  const editUser = async (id: string) => {
    try {
      const response = await axios.put<User>(`${apiUrl}/${id}`, updateUser);
      setUsers(users.map(user => (user.id === id ? response.data : user)));
      setUpdateUser({ id: '', name: '', avatar: '' });
      setIsEdit(false);
    } catch (error) {
      console.error('Kullanıcıyı güncellerken hata oluştu:', error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Kullanıcı silerken hata oluştu:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
  setUpdateUser({ id: user.id, name: user.name, avatar: user.avatar || '' });
  setIsEdit(true);
};


  return (
    <div className='w-full'>
      <h1 className="text-3xl font-bold mb-6 text-center">Kullanıcılar</h1>

      <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-8 mb-8 w-full">
        {users.map(user => (
          <div key={user.id} className="bg-white w-48 p-4 rounded-lg shadow-md flex flex-col items-center">
            <img
              src={user.avatar ? user.avatar : 'https://i.pravatar.cc/150'}
              alt={user.name} 
              className="w-20 h-20 rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold text-center truncate w-full">{user.name}</h3>
           
            <div className="flex flex-row mt-4 space-x-2">
              <button
                onClick={() => deleteUser(user.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
              >
                Sil
              </button>
              <button
                onClick={() => handleEdit(user)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              >
                Güncelle
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">{isEdit ? 'Kullanıcıyı Güncelle' : 'Yeni Kullanıcı Ekle'}</h2>

        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Ad"
            value={isEdit ? updateUser.name : newUser.name}
            onChange={(e) => isEdit
              ? setUpdateUser({ ...updateUser, name: e.target.value })
              : setNewUser({ ...newUser, name: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => isEdit ? editUser(updateUser.id) : addUser()}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          >
            {isEdit ? 'Güncelle' : 'Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
