import React from "react";
import { useSafeNavigation } from "@hooks/useSafeNavigation";
import ThemedButton from "./ThemedButton";

type ThemedButtonLinkProps = React.ComponentProps<typeof ThemedButton> & {
  href: string;
};

const ThemedButtonLink: React.FC<ThemedButtonLinkProps> = ({
  href,
  ...props
}) => {
  const {navigate} = useSafeNavigation();

  return (
    <ThemedButton
      {...props}
      onPress={navigate(href)}
    />
  );
};

export default ThemedButtonLink;
