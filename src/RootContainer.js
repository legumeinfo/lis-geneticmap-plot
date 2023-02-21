import React from 'react';
import { useState, useEffect } from 'react';
import Loader from './common/loader';
import CanvasXpressReact from 'canvasxpress-react';

import queryLinkageGroups from "./queryLinkageGroups";
import queryQTLs from "./queryQTLs";
import queryMarkers from "./queryMarkers";
import getData from "./getData";

export default function RootContainer({ serviceUrl, entity, config }) {
    const geneticMapId = entity.value;

    const [error, setError] = useState(null);
    const [linkageGroups, setLinkageGroups] = useState(null);
    const [markers, setMarkers] = useState(null);
    const [qtls, setQtls] = useState(null);
    const [data, setData] = useState(null);
    
    useEffect(() => {
        // linkage groups
        const linkageGroups = [];
        queryLinkageGroups(geneticMapId, serviceUrl)
            .then(response => {
                response.forEach(result => {
                    linkageGroups.push(result);
                });
                setLinkageGroups(linkageGroups);
            })
            .catch(() => {
                setError("LinkageGroup data not found for GeneticMap.id="+geneticMapId);
            });
        // all markers
        const markers = [];
        queryMarkers(geneticMapId, serviceUrl)
            .then(response => {
                response.forEach(result => {
                    markers.push(result);
                });
                setMarkers(markers);
            })
            .catch(() => {
                setError("Marker data not found for GeneticMap.id="+geneticMapId);
            });
        // all QTLs
        const qtls = [];
        queryQTLs(geneticMapId, serviceUrl)
            .then(response => {
                response.forEach(result => {
                    qtls.push(result);
                });
                setQtls(qtls);
            })
            .catch(() => {
                // do nothing, some maps do not have QTLs
            });
    }, []);

    if (error) return (
        <div className="rootContainer error">{ error }</div>
    );

    // track data
    useEffect(() => {
        setData(getData(linkageGroups, markers, qtls));
    }, [linkageGroups, markers, qtls]);
    
    // (mostly) static canvasXpress config
    const conf = {
        "graphType": "Genome",
        "backgroundType": "solid",
        "showShadow": false,
        "featureStaggered": true,
        "background": "white",
        "fontName": "Arial",
        "featureNameFontSize": 10,
        "featureNameFontColor": "darkgreen",
        "featureHeightDefault": 5,
        "xAxisTickColor": "black",
        "wireColor": "darkgray",
        "setMinX": 0,
        "xAxisExact": false
    }

    // QTL click opens a new QTL report page
    // window.location.href: http://domain.org/beanmine/report/GeneticMap/29000003
    // QTL page:             http://domain.org/beanmine/report/QTL/7900003
    var evts = {
        "click": function(o, e, t) {
            if (o) {
                const qtlId = o[0].data[0].key;
                if (qtlId) {
                    const uriParts = window.location.href.split("GeneticMap");
                    window.open(uriParts[0]+"QTL/"+qtlId);
                }
            }
        }
    }
    
    return (
        <div className="rootContainer">
            {data && (
                <CanvasXpressReact target={"canvas"} data={data} config={conf} height={500} width={1150} events={evts} />
            )}
            {!data && (
                <Loader />
            )}
        </div>
    );

}
