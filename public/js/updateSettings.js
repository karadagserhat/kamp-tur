/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url = type === 'password' ? '/api/v1/users/updateMyPassword' : '/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url: url,
      data: data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `Güncelleme başarıyla gerçekleşti!`);
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    window.setTimeout(() => {
      location.reload();
    }, 1500);
  }
};

// export const updateData = async (name, email) => {
//   try {
//     const res = await axios({
//       method: 'PATCH',
//       url: 'http://localhost:3000/api/v1/users/updateMe',
//       data: {
//         name,
//         email,
//       },
//     });

//     if (res.data.status === 'success') {
//       showAlert('success', 'Güncelleme başarılı!');
//     }
//   } catch (err) {
//     showAlert('error', err.response.data.message);
//   }
// };
