function mainPage() {
    return (
      <div>
        <h1>Products</h1>
        {Array.from({ length: 100 }, (_, i) => (
        <div key={i} className="w-full border">
          Content {i}
        </div>
      ))}
      </div>
    );
  }
  export default mainPage;
  