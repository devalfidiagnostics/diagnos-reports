import Header from "../components/Header";
import UploadBox from "../components/UploadBox";

export default function Landing() {
  return (
    <>
      <Header />
      <div className="min-h-screen  bg-gradient-to-br from-orange-50 via-white to-gray-50 py-8 md:py-12 px-4">
        <div className="flex justify-center items-center min-h-[calc(100vh-120px)]">
          <UploadBox />
        </div>
      </div>
    </>
  );
}
