import { Paper, Button, createStyles, Group, Text } from "@mantine/core";
import { IconWallet } from "@tabler/icons";
import { useEffect } from "react";
import { useState } from "react";
import { useMetamask } from "@thirdweb-dev/react";

export default function NotConnected() {
  //const { address, connectWallet } = useWeb3();
  const connectWithMetamask = useMetamask();
  return (
    <Group position="center">
      <Paper>
        <Group position="center" mt={20} mb={10}>
          <div>
            <Text
              component="span"
              align="center"
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan", deg: 45 }}
              size="xl"
              weight={700}
              style={{ fontFamily: "Greycliff CF, sans-serif" }}
            >
              Please Connect Your Wallet
            </Text>
          </div>
        </Group>
        <Group position="center" mb={20}>
          <div>
            <Button
              leftIcon={<IconWallet />}
              radius="lg"
              size="xl"
              variant="gradient"
              gradient={{ from: "pink", to: "yellow" }}
              onClick={connectWithMetamask}
            >
              Connect to wallet
            </Button>
          </div>
        </Group>
      </Paper>
    </Group>
  );
}
