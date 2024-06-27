import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export function nftItemConfigToCell(): Cell {
    return beginCell().endCell();
}

export class NftItem implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new NftItem(address);
    }

    static createFromConfig( code: Cell, workchain = 0) {
        const data = nftItemConfigToCell();
        const init = { code, data };
        return new NftItem(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
    async sendTransfer(provider: ContractProvider, via: Sender,
                       opts: {
                           queryId: number;
                           value: bigint;
                           newOwner: Address;
                           responseAddress?: Address;
                           fwdAmount?: bigint;
                       }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x5fcc3d14, 32)
                .storeUint(opts.queryId, 64)
                .storeAddress(opts.newOwner)
                .storeAddress(opts.responseAddress || null)
                .storeBit(false) // no custom payload
                .storeCoins(opts.fwdAmount || 0)
                .storeBit(false) // no forward payload
                .endCell(),
        });
    }

    async get_item_in_nft(provider: ContractProvider) {
        const res = await provider.get('get_nft_data', []);
        return res.stack;
    }

}
