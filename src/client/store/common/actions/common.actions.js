export function loader(action) {
  return {
    type: 'LOADER_VIEW',
    payload: action,
  };
}

export function publishError(error) {
  return {
    type: 'ERROR',
    payload: error,
  };
}
