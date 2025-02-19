function generateNames(category, keywords = [], style) {
    const prefixes = {
        technology: ['Tech', 'Cyber', 'Digi', 'Smart', 'Quantum', 'Byte', 'Net', 'Data'],
        fashion: ['Chic', 'Luxe', 'Vogue', 'Style', 'Trend', 'Mode', 'Glam', 'Fab'],
        food: ['Taste', 'Fresh', 'Spice', 'Savor', 'Feast', 'Chef', 'Flavor', 'Bite'],
        health: ['Vital', 'Well', 'Life', 'Pure', 'Natural', 'Bio', 'Health', 'Zen'],
        entertainment: ['Fun', 'Play', 'Joy', 'Vibe', 'Buzz', 'Star', 'Thrill', 'Epic'],
        education: ['Learn', 'Mind', 'Brain', 'Edu', 'Know', 'Skill', 'Study', 'Wisdom']
    };

    const suffixes = {
        technology: ['ify', 'io', 'ix', 'tech', 'hub', 'sync', 'bit', 'ware'],
        fashion: ['wear', 'style', 'look', 'vogue', 'trend', 'mode', 'chic', 'fit'],
        food: ['bites', 'eats', 'dish', 'feast', 'taste', 'chef', 'kitchen', 'plate'],
        health: ['life', 'well', 'fit', 'care', 'plus', 'zen', 'glow', 'boost'],
        entertainment: ['fun', 'play', 'joy', 'zone', 'spot', 'hub', 'time', 'space'],
        education: ['mind', 'learn', 'skill', 'edu', 'path', 'wise', 'brain', 'pro']
    };

    const transformWord = (word) => {
        if (!word) return '';
        word = word.trim().toLowerCase();
        return word.charAt(0).toUpperCase() + word.slice(1);
    };

    const generateName = () => {
        const prefix = prefixes[category][Math.floor(Math.random() * prefixes[category].length)];
        const suffix = suffixes[category][Math.floor(Math.random() * suffixes[category].length)];
        const keyword = keywords.length > 0 ? keywords[Math.floor(Math.random() * keywords.length)] : '';

        const patterns = [
            // Prefix + Suffix
            () => prefix + suffix,
            // Prefix + Modified Suffix
            () => prefix + suffix.charAt(0).toUpperCase() + suffix.slice(1),
            // Keyword + Suffix (if keyword exists)
            () => keyword ? transformWord(keyword) + suffix : prefix + suffix,
            // Prefix + Keyword (if keyword exists)
            () => keyword ? prefix + transformWord(keyword) : prefix + suffix,
            // Custom combination
            () => {
                const parts = [prefix];
                if (keyword) parts.push(transformWord(keyword));
                parts.push(suffix);
                return parts.join('');
            }
        ];

        return patterns[Math.floor(Math.random() * patterns.length)]();
    };

    // Generate 6 unique names
    const names = new Set();
    while (names.size < 6) {
        names.add(generateName());
    }

    return Array.from(names);
}
