module.exports = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'media.istockphoto.com',
                port: '',
                pathname: '/id/**',
            },
            {
                protocol: 'https',
                hostname: 's2.coinmarketcap.com',
                port: '',
                pathname: '/static/**',
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
}