import axios from "axios";
const baseUrl = "/api/persons";

const getAll = () => {
  const request = axios.get(baseUrl).then((response) => response.data);
  return request;
};

const create = (newPerson) => {
  const request = axios
    .post(baseUrl, newPerson)
    .then((response) => response.data);
  return request;
};

const update = (id, newPerson) => {
  const request = axios
    .put(baseUrl.concat("/", id), newPerson)
    .then((response) => response.data);
  return request;
};

const remove = (id) => {
  const request = axios
    .delete(baseUrl.concat("/", id))
    .then((response) => response.data);
  return request;
};

export default { getAll, create, update, remove };
