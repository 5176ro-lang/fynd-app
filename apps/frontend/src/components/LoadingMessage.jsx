export default function LoadingMessage({ label = 'Loading listings…' }) {
  return <p className="state-message">{label}</p>;
}