export const html = (t, label, options) => (
  <div dangerouslySetInnerHTML={{ __html: t(label, options) }} />
);

export const nl2br = text =>
  text && text.split("\n").map((line, index) => <span key={index}>{line}<br/></span>);

export default { html };
