import ErrorPageArea from "../components/error/error-page-area";
import Header from "@/layouts/headers/header";
import Wrapper from "@/layouts/wrapper";
import FooterOne from "@/layouts/footers/footer-one";

export default function NotFound() {
  return (
    <Wrapper>
      <div className="main-page-wrapper">
        <Header />
        <ErrorPageArea/>
        <FooterOne />
      </div>
    </Wrapper>
  );
}
