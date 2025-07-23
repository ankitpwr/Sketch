export default function TextArea({
  refer,
}: {
  refer: React.Ref<HTMLTextAreaElement>;
}) {
  return (
    <textarea
      id="text-editor"
      ref={refer}
      onFocus={() => console.log(`is in focus`)}
      style={{
        display: "none",
        resize: "none",
        position: "absolute",
        background: "transparent",
        outline: "none",
        border: "1px dotted  #555",
        lineHeight: 1.5,
      }}
    ></textarea>
  );
}
