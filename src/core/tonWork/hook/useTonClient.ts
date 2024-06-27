// import { useInit } from "./useInit";
import {Address, Sender, SenderArguments, TonClient} from "ton";
import {CHAIN, useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";
// import { useAsyncInit } from "./useAsyncInit";
import {useInit} from "./useInit.ts";

export function useTonClient() {
    return useInit(
        async () =>
            new TonClient({
                endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC?api_key=77cddd90e2f480b8b0e222ceba430cfe50a737b12be0576af85555dd21ab5c60",
                // endpoint: "https://toncenter.com/api/v2/jsonRPC?api_key=44f7a4db5eb696f165782d9de2820eb5e537e8eae6af5fe71d777958ebc82741"
            })
    );
}


export function useTonConnected() : {
    sender: Sender;
    connected: boolean;
    wallet: string | null;
    network: CHAIN | null;
} {
    const [tonConnectUI] = useTonConnectUI()
    const wallet = useTonWallet()
    return {
        sender: {
            send: async (args: SenderArguments) => {
                tonConnectUI.sendTransaction({
                    messages: [
                        {
                            address: args.to.toString(),
                            amount: args.value.toString(),
                            payload: args.body?.toBoc().toString("base64"),
                        },
                    ],
                    validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
                });
            },
            address: wallet?.account?.address ? Address.parse(wallet?.account?.address as string) : undefined
        },

        connected: !!wallet?.account.address,
        wallet: wallet?.account.address ?? null,
        network: wallet?.account.chain ?? null
    }
}