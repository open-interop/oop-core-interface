import React, { useState, useEffect, memo } from "react";

import {
    AccordionWithCaption,
    ConfirmModal,
    Page,
    InPlaceGifSpinner,
    MaxCard,
    DataProvider,
} from "../Universal";

import { Graphviz } from 'graphviz-react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import OopCore from "../../OopCore";


const TemprMap = props => {
    const [nodes, setNodes] = useState({});
    const [paths, setPaths] = useState([]);
    const [title, setTitle] = useState("");

    const temprOriginPath = '/temprs/' + props.match.params.temprId;

    const formatNode = (temprObj) => {
    	return `${temprObj.id}[shape=plain, fontname=Helvetica,
				label=<
				<table border="${temprObj.id == props.match.params.temprId ? '2' : '1'}" color="${temprObj.id == props.match.params.temprId ? '#177692' : 'black'}" cellborder="0" cellspacing="0" cellpadding="2">
			    	<tr>
			     		<td align="left" colspan="8">
			     			<font point-size="16" color="${temprObj.id == props.match.params.temprId ? '#177692' : 'black'}"><u>${temprObj.name}</u></font>
		     			</td>
		     			<td colspan="1" align="right">
			     			<table cellborder="0" cellspacing="1" border="0" cellpadding="0">
			     				<tr>
			     					<td></td>
			     					<td></td>
			     				</tr>
			     				<tr>
			     					<td></td>
			     					<td></td>
			     					<td cellpadding="1" colspan="1" bgcolor="#177692" tooltip="Edit ${temprObj.name}" href="/temprs/${temprObj.id}">
						     			<font point-size="12" color="white">&#9998;</font>
					     			</td>
			     					<td></td>
			     				</tr>
			     			</table>
		     			</td>
		     		</tr>
		     		<tr><td colspan="12">&nbsp;</td></tr>
			     	<tr>
			     		<td colspan="6">
			     			<table cellborder="0" color="black" cellspacing="2" border="0" cellpadding="5">
			     				<tr>
			     					<td align="text" colspan="2" bgcolor="${temprObj.queueRequest ? '#28364D' : '#D3D3D3'}"><font point-size="16" color="white">&#8659;</font></td>
			     					<td align="text" colspan="2" bgcolor="${temprObj.queueResponse ? '#28364D' : '#D3D3D3'}"><font point-size="16" color="white">&#8657;</font></td>
			     					<td colspan="1">&nbsp;</td>
			     					<td colspan="1" border="1"><font point-size="10">${temprObj.endpointType}</font></td>
			     				</tr>
			     			</table>
		     			</td>
		     		</tr>
			   	</table>
			   	>]`;
    };

	async function getData(temprId){
		var tempr = await OopCore.getTempr(temprId);
		var children = await OopCore.getTemprs({temprId: temprId});
		var childrenData = [];
        for (var i = children.data.length - 1; i >= 0; i--) {
            if (children.data[i].temprId == temprId) {
                childrenData.push(children.data[i]);
            }
        }
		const titleNode = tempr.name;
		while (tempr) {
			if (!nodes[tempr.id]) {
				nodes[tempr.id] = formatNode(tempr);
			}
			if (tempr.temprId) {
				paths.push(`${tempr.temprId}->${tempr.id}`);
				if (nodes[tempr.temprId]){
					tempr = null;
				} else {
					tempr = await OopCore.getTempr(tempr.temprId);
					childrenData.push(tempr);
				}
			} else {
				tempr = null;
			}
		}
		while (childrenData.length > 0) {
			const c = childrenData.shift();
			if (c.temprId) {
				if (!nodes[c.id]) {
					nodes[c.id] = formatNode(c);
				}
				paths.push(`${c.temprId}->${c.id}`);
				var new_children = await OopCore.getTemprs({temprId: c.id});
				new_children = new_children.data;
				for (var i = new_children.length - 1; i >= 0; i--) {
					if (!nodes[new_children[i].id] && new_children[i].temprId == c.id) {
						childrenData.push(new_children[i]);
					}
				}
			}
		}
		const unique_paths = [...new Set(paths)];
		let response = {nodes:nodes,paths:unique_paths,title:titleNode};
		return (response);
	};

	return (
    	<DataProvider
            getData={() => {
                return getData(props.match.params.temprId).then(response => {
                    setNodes(response.nodes);
                    setPaths(response.paths);
                    setTitle(response.title);
                    return response;
                });
            }}
            renderData={() => (
                <Page
					title={"Tempr Map | Settings | Open Interop"}
		            heading={"Tempr: " + title + "'s Map"}
					backlink={props.location.prevPath || temprOriginPath}
		        >	
			        <Graphviz 
				        dot={
				        	`digraph {
				       			${Object.values(nodes).join('\n')}
				       			${paths.join('\n')}
				       			splines=ortho
				       			nodesep=1
							}`
						}
						options={{
							fit:true,
							height:'auto',
							width:'auto',
							zoom:false,
						}}
					/>
				</Page>
			)}
        />
	);
};

export { TemprMap };
