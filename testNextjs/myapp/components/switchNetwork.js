import { Paper, Button, createStyles, Group, Text } from "@mantine/core";
import { IconWallet } from "@tabler/icons";
import { useEffect } from "react";
import { useState } from "react";
import { ChainId, useNetwork } from "@thirdweb-dev/react";

const useStyles = createStyles((theme) => ({
  title: {
    marginTop: 30,
    marginBottom: 30,
  },
  button: {
    marginTop: 10,
    marginBottom: 30,
  },
  btn: {
    width: 350,
  },
  text: {
    fontSize: 30,
  },
}));

export default function SwitchNetwork() {
  const { classes } = useStyles();
  //const { address, connectWallet } = useWeb3();
  const [, switchNetwork] = useNetwork();

  return (
    <Group position="center">
      <Paper>
        <Group position="center">
          <div className={classes.title}>
            <Text
              component="span"
              align="center"
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan", deg: 45 }}
              size="xl"
              weight={700}
              className={classes.text}
              style={{ fontFamily: "Greycliff CF, sans-serif" }}
            >
              Please Switch Network to BSC Test Net
            </Text>
          </div>
        </Group>
        <Group position="center">
          <div className={classes.button}>
            <Button
              leftIcon={<IconWallet />}
              radius="lg"
              size="xl"
              variant="gradient"
              gradient={{ from: "pink", to: "yellow" }}
              className={classes.btn}
              // @ts-ignore
              onClick={() => switchNetwork(ChainId.BinanceSmartChainTestnet)}
            >
              Switch Network
            </Button>
          </div>
        </Group>
      </Paper>
    </Group>
  );
}
