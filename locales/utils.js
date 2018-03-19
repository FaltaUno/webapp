export const html = (t, label, options) => (
  <div dangerouslySetInnerHTML={{ __html: t(label, options) }} />
);

export default { html };
