export default function (response) {
  const json = response.json();

  if (response.status >= 200 && response.status < 300) {
    return json;
  }

  return json.then(err => Promise.reject(err));
}
