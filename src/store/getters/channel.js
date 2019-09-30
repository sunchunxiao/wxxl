const channel = {
    channelTree: state => state.channel.tree,
    channelProgressArr: state => state.channel.channelProgressArr,
    channelTrendArr: state => state.channel.channelTrendArr,
    channelStructureArr: state => state.channel.channelStructureArr,
    channelRankArr: state => state.channel.channelRankArr,
    channelCompareArr: state => state.channel.channelCompareArr,
    channelHistoryArr: state => state.channel.channelHistoryArr,
    channelLastParams: state => state.channel.channelLastParams,
    channelLastcidObjArr: state => state.channel.channelLastcidObjArr,
    channelAchievement: state => state.channel.channelAchievement,
    channelAchievementOpt: state => state.channel.channelAchievementOpt,
};

export default channel;
