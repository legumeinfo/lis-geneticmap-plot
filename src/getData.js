// {
//     "tracks": [
//         {
//             "type": "box",
//             "data": [
//                 {
//                     "key": 93000009,
//                     "fill": "purple",
//                     "id": "B04",
//                     "data": [
//                         [
//                             0,
//                             112.7
//                         ]
//                     ],
//                     "outline": "black"
//                 }
//             ]
//         },
//         {
//             "type": "triangle",
//             "data": [
//                 {
//                     "fill": "darkred",
//                     "id": "L040.75",
//                     "offset": 26.7,
//                     "outline": "black"
//                 },
//             ]
//         },
//         {
//             "type": "box",
//             "data": [
//                 {
//                     "key": 101000007,
//                     "fill": "yellow",
//                     "id": "Int4",
//                     "data": [
//                         [
//                             26,
//                             38
//                         ]
//                     ],
//                     "outline": "black"
//                 },
//             ]
//         }
//     ]
// }

// linkageGroups
// {"identifier":"B10","number":10,"length":105,"class":"LinkageGroup","objectId":93000004}
// markers
// {"linkageGroup":{"identifier":"B03","class":"LinkageGroup","objectId":93000008},"position":12.8,"class":"LinkageGroupPosition","markerName":"BM189","objectId":93000015}
// qtls
// {"identifier":"Int1","start":21,"linkageGroup":{"identifier":"B03","class":"LinkageGroup","objectId":93000008},"end":37,"class":"QTL","objectId":101000003}


/**
 * Return a ChartXpress data object for the linkage group plot.
 */
export default function getData(linkageGroups, markers, qtls) {
    if (!linkageGroups) {
        return null;
    }

    // HACK: sort the linkage groups by number because jsonobjects queries don't follow sort order
    const sortedLGs = new Array(linkageGroups.length);
    linkageGroups.map(linkageGroup => {
        sortedLGs[linkageGroup.number-1] = linkageGroup;
    });

    const tracks = [];

    sortedLGs.map(linkageGroup => {
        const lgData = [
            {
                "key": linkageGroup.objectId,
                "fill": "purple",
                "id": linkageGroup.identifier,
                "data": [
                    [
                        0,
                        linkageGroup.length
                    ]
                ],
                "outline": "black"
            }
        ];
        const lgTrack = {
            "type": "box",
            "data": lgData
        };
        tracks.push(lgTrack);
        
        if (markers) {
            // this is inefficient
            const markerData = [];
            markers.map(marker => {
                if (marker.linkageGroup.objectId === linkageGroup.objectId) {
                    markerData.push({
                        "fill": "darkred",
                        "id": marker.markerName,
                        "offset": marker.position,
                        "outline": "black"
                    });
                }
            });
            if (markerData.length>0) {
                const markerTrack = {
                    "type": "triangle",
                    "data": markerData
                };
                tracks.push(markerTrack);
            }
        }
        
        if (qtls) {
            // this is also inefficient
            const qtlData = [];
            qtls.map(qtl => {
                if (qtl.linkageGroup.objectId === linkageGroup.objectId) {
                    qtlData.push({
                        "key": qtl.objectId,
                        "fill": "yellow",
                        "id": qtl.identifier,
                        "data": [[ qtl.start, qtl.end ]],
                        "outline": "black"
                    });
                }
            });
            if (qtlData.length>0) {
                const qtlTrack = {
                    "type": "box",
                    "data": qtlData
                };
                tracks.push(qtlTrack);
            }
        }
        
    });

    return {
        "tracks": tracks
    };
}
