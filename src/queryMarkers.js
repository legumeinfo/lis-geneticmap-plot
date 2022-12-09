/**
 * Query all the markers for a given GeneticMap.
 */
export default function queryMarkers(geneticMapId, serviceUrl, imjsClient = imjs) {
    return new Promise((resolve, reject) => {
        const query = pathQuery({ geneticMapId });
	// eslint-disable-next-line
	const service = new imjsClient.Service({ root: serviceUrl });
	service
	    .records(query)
	    .then(data => {
		if (data && data.length) {
                    resolve(data);
		} else {
                    reject('No marker data found!');
                }
	    })
	    .catch(reject);
    });
}

// LinkageGroupPosition.linkageGroup.identifier
// LinkageGroupPosition.markerName
// LinkageGroupPosition.position
// LinkageGroupPosition.linkageGroup.geneticMap.primaryIdentifier
// sortOrder="LinkageGroupPosition.linkageGroup.identifier asc">
// LinkageGroupPosition.linkageGroup.geneticMap.primaryIdentifier" op="=" value="BAT93_x_JALOEEP558.Freyre_Skroch_1998"/>

const pathQuery = ({ geneticMapId }) => ({
    from: 'LinkageGroupPosition',
    select: [
        'linkageGroup.identifier',
        'markerName',
        'position'
    ],
    orderBy: [
        {
            path: 'linkageGroup.identifier',
            direction: 'ASC'
        },
        {
            path: 'position',
            direction: 'ASC'
        }
    ],
    where: [
	{
	    path: 'linkageGroup.geneticMap.id',
	    op: '=',
	    value: geneticMapId
	}
    ]
});
