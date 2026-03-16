export default function StarryBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black">
      {/* Nebula Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] bg-cyan-900/10 blur-[120px] rounded-full"></div>
      <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] bg-indigo-900/5 blur-[100px] rounded-full"></div>

      {/* Starfield */}
      <div
        className="absolute inset-0 opacity-30 animate-pulse-slow"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20px 30px, white, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, white, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 150px 150px, white, rgba(0,0,0,0)), radial-gradient(1px 1px at 200px 80px, white, rgba(0,0,0,0)), radial-gradient(1px 1px at 280px 120px, white, rgba(0,0,0,0))",
          backgroundSize: "300px 300px",
        }}
      ></div>
      <div
        className="absolute inset-0 opacity-20 animate-pulse-slower"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 100px 200px, white, rgba(0,0,0,0)), radial-gradient(1px 1px at 250px 350px, white, rgba(0,0,0,0)), radial-gradient(1px 1px at 50px 450px, white, rgba(0,0,0,0))",
          backgroundSize: "500px 500px",
        }}
      ></div>
    </div>
  );
}
