import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const baseUrl = "https://devsoc-gamenvt-ticket.vercel.app/idcard";

export const RaycastMagicLinkEmail = () => (
  <Html>
    <Head />
    <Preview>Congrats you are verified to attend game development session by DevSoc</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>🪄 Your DevSoc ID Card</Heading>
        <Section style={body}>
          <Text style={paragraph}>
            <Link style={link} href={baseUrl}>
              👉 Click here to sign in 👈
            </Link>
          </Text>
          <Text style={paragraph}>
          Congrats you are verified to attend game development session by DevSoc
          </Text>
        </Section>
        <Text style={paragraph}>
          Best,
          <br />- DevSoc Team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>DevSoc Asansol</Text>
      </Container>
    </Body>
  </Html>
);

RaycastMagicLinkEmail.PreviewProps = {
  magicLink: "https://raycast.com",
};

export default RaycastMagicLinkEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 25px 48px",
  backgroundImage: 'url("/assets/raycast-bg.png")',
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat, no-repeat",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "48px",
};

const body = {
  margin: "24px 0",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const link = {
  color: "#FF6363",
};

const hr = {
  borderColor: "#dddddd",
  marginTop: "48px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  marginLeft: "4px",
};
