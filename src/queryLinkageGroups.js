/**
 * Query the linkage groups for the given genetic map.
 */
export default function queryLinkageGroups(geneticMapId, serviceUrl, imjsClient = imjs) {
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
                    reject('No linkage groups found found!');
                }
	    })
	    .catch(reject);
    });
}

const pathQuery = ({ geneticMapId }) => ({
    from: 'LinkageGroup',
    select: [
        'identifier',
        'number',
        'length',
    ],
    orderBy: [
        { path: 'identifier', direction: 'ASC' }
    ],
    where: [
	{ path: 'geneticMap.id', op: '=', value: geneticMapId }
    ]
});
