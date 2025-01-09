const Heading = ({ title }: { title: string }) => {
  return (
    <h1
      className="page-heading"
      style={{
        fontSize: "2.5rem",
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        margin: "20px 0",
        fontFamily: "Arial",
        textTransform: "uppercase",
      }}
    >
      {title}
    </h1>
  );
};

export default Heading;
