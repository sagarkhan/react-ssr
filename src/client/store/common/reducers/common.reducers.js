export default function CommonReducer(
  state = {
    loader: false,
    error: {},
  },
  action,
) {
  switch (action.type) {
    case 'LOADER_VIEW':
      return { ...state, loader: action.payload };
    case 'ERROR':
      return { ...state, error: action.payload };
    default:
      return { ...state };
  }
}
