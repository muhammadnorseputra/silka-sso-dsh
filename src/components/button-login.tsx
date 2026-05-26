"use client";

import { FingerPrintIcon } from "@heroicons/react/24/solid";
import { Button } from "@heroui/button";

const ButtonLogin = () => {
  return (
    <Button
      size="lg"
      variant="solid"
      color="primary"
      startContent={<FingerPrintIcon className="h-6 w-6" />}>
      Masuk
    </Button>
  );
};

export default ButtonLogin;
