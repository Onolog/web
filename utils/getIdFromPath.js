// @flow

export default function getIdFromPath(): number {
  const id = document.location.pathname.split('/').pop();
  return parseInt(id, 10);
}
