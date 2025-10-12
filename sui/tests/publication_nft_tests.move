#[test_only]
module publication_nft::publication_nft_tests {
    use std::string::{Self, String};
    use sui::test_scenario::{Self as ts};
    use publication_nft::publication_nft::{Self, PublicationNFT};

    const ADMIN: address = @0xAD;
    const USER1: address = @0xB0B;
    const USER2: address = @0xC0C;

    fun create_test_string(bytes: vector<u8>): String {
        string::utf8(bytes)
    }

    #[test]
    fun test_mint_publication_nft() {
        let mut scenario = ts::begin(ADMIN);
        
        // Mint a new publication NFT
        {
            ts::next_tx(&mut scenario, ADMIN);
            publication_nft::mint(
                create_test_string(b"Test Book"),
                create_test_string(b"Test Author"),
                1234567890000,
                create_test_string(b"10.1000/test-doi"),
                b"https://ipfs.io/ipfs/QmTest",
                b"https://ipfs.io/ipfs/QmTestImage",
                create_test_string(b"Test description"),
                create_test_string(b"CC-BY-4.0"),
                create_test_string(b"Computer Science"),
                create_test_string(b"1.0"),
                b"https://example.com/paper",
                USER1,
                ts::ctx(&mut scenario)
            );
        };

        // Verify the NFT was minted and sent to USER1
        {
            ts::next_tx(&mut scenario, USER1);
            let nft = ts::take_from_sender<PublicationNFT>(&scenario);
            
            assert!(publication_nft::title(&nft) == create_test_string(b"Test Book"), 0);
            assert!(publication_nft::authors(&nft) == create_test_string(b"Test Author"), 1);
            assert!(publication_nft::publication_date(&nft) == 1234567890000, 2);
            assert!(publication_nft::doi(&nft) == create_test_string(b"10.1000/test-doi"), 3);
            
            ts::return_to_sender(&scenario, nft);
        };

        ts::end(scenario);
    }

    #[test]
    fun test_transfer_publication_nft() {
        let mut scenario = ts::begin(ADMIN);
        
        // Mint a new publication NFT
        {
            ts::next_tx(&mut scenario, ADMIN);
            publication_nft::mint(
                create_test_string(b"Test Book"),
                create_test_string(b"Test Author"),
                1234567890000,
                create_test_string(b"10.1000/test-doi"),
                b"https://ipfs.io/ipfs/QmTest",
                b"https://ipfs.io/ipfs/QmTestImage",
                create_test_string(b"Test description"),
                create_test_string(b"CC-BY-4.0"),
                create_test_string(b"Computer Science"),
                create_test_string(b"1.0"),
                b"https://example.com/paper",
                USER1,
                ts::ctx(&mut scenario)
            );
        };

        // Transfer the NFT from USER1 to USER2
        {
            ts::next_tx(&mut scenario, USER1);
            let nft = ts::take_from_sender<PublicationNFT>(&scenario);
            publication_nft::transfer_nft(nft, USER2, ts::ctx(&mut scenario));
        };

        // Verify USER2 now owns the NFT
        {
            ts::next_tx(&mut scenario, USER2);
            let nft = ts::take_from_sender<PublicationNFT>(&scenario);
            assert!(publication_nft::title(&nft) == create_test_string(b"Test Book"), 0);
            ts::return_to_sender(&scenario, nft);
        };

        ts::end(scenario);
    }

    #[test]
    fun test_burn_publication_nft() {
        let mut scenario = ts::begin(ADMIN);
        
        // Mint a new publication NFT
        {
            ts::next_tx(&mut scenario, ADMIN);
            publication_nft::mint(
                create_test_string(b"Test Book"),
                create_test_string(b"Test Author"),
                1234567890000,
                create_test_string(b"10.1000/test-doi"),
                b"https://ipfs.io/ipfs/QmTest",
                b"https://ipfs.io/ipfs/QmTestImage",
                create_test_string(b"Test description"),
                create_test_string(b"CC-BY-4.0"),
                create_test_string(b"Computer Science"),
                create_test_string(b"1.0"),
                b"https://example.com/paper",
                USER1,
                ts::ctx(&mut scenario)
            );
        };

        // Burn the NFT
        {
            ts::next_tx(&mut scenario, USER1);
            let nft = ts::take_from_sender<PublicationNFT>(&scenario);
            publication_nft::burn(nft, ts::ctx(&mut scenario));
        };

        ts::end(scenario);
    }
}
