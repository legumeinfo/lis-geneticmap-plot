/**
 * Query the QTLs for a given GeneticMap.
 */
export default function queryQTLs(geneticMapId, serviceUrl, imjsClient = imjs) {
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
                    reject('No QTL data found!');
                }
	    })
	    .catch(reject);
    });
}

const pathQuery = ({ geneticMapId }) => ({
    from: 'QTL',
    select: [
        'identifier',
        'linkageGroup.identifier',
        'start',
        'end'
    ],
    orderBy: [
        {
            path: 'linkageGroup.identifier',
            direction: 'ASC'
        },
        {
            path: 'start',
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
