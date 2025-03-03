export const getToken = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    console.warn('⚠ No token found in localStorage.')
  }
  return token
}
