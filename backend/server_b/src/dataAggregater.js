export const aggregateData = async (emoteData, threshold) => {
    const significantMoments = [];
    const emoteCounts = {};

    emoteData.forEach(record => {
        const timestamp = record.timestamp.slice(0, 16); // Minute-level granularity
        const emote = record.emote;

        if (!emoteCounts[timestamp]) {
            emoteCounts[timestamp] = { total: 0 };
        }

        if (!emoteCounts[timestamp][emote]) {
            emoteCounts[timestamp][emote] = 0;
        }

        emoteCounts[timestamp][emote]++;
        emoteCounts[timestamp].total++;
    });

    for (const timestamp in emoteCounts) {
        const counts = emoteCounts[timestamp];
        const totalEmotes = counts.total;

        for (const emote in counts) {
            if (emote !== 'total' && counts[emote] / totalEmotes > threshold) {
                significantMoments.push({
                    timestamp,
                    emote,
                    count: counts[emote],
                    totalEmotes
                });
            }
        }
    }

    return significantMoments;
}