import dynamic from "next/dynamic";

const NoSSRKonva = dynamic(() => import("@/components/Konva"), {
  ssr: false,
});

const Home = () => {
  return (
    <div>
      <NoSSRKonva />
    </div>
  );
};

export default Home;
