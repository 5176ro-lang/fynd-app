export default function EmptyState({ message = 'Nothing here yet.', error = false }) {
  return <p className={`state-message ${error ? 'error' : ''}`}>{message}</p>;
}