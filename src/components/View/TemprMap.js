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

    const formatNode = (temprObj, color) => {
    	return `${temprObj.id}[shape=plain, fontname=Helvetica,
				label=<
				<table border="${color != 'black' ? '2' : '1'}" color="${color}" cellborder="0" cellspacing="0" cellpadding="2">
			    	<tr>
			     		<td align="left" colspan="8">
			     			<font point-size="16" color="${color}"><u>${temprObj.name}</u></font>
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
		children = children.data;
		var color = '#177692';
		const titleNode = tempr.name;
		while (tempr) {
			nodes[tempr.id] = formatNode(tempr,color);
			if (tempr.temprId) {
				paths.push(`${tempr.temprId}->${tempr.id}`);
				if (nodes[tempr.temprId]){
					tempr = null;
				} else{
					tempr = await OopCore.getTempr(tempr.temprId);
				}
			} else {
				tempr = null;
			}
			color = 'black';
		}
		while (children.length > 0) {
			const c = children.shift();
			nodes[c.id] = formatNode(c, color);
			paths.push(`${c.temprId}->${c.id}`);
			var new_children = await OopCore.getTemprs({temprId: c.id});
			new_children = new_children.data;
			for (var i = new_children.length - 1; i >= 0; i--) {
				if (!nodes[new_children[i].id]){
					children.push(new_children[i]);
				}
			}
		}
		const unique_paths = [...new Set(paths)];
		let response = {nodes:nodes,paths:unique_paths,titleNode:titleNode};
		return (response);
	};

	return (
    	<DataProvider
            getData={() => {
                return getData(props.match.params.temprId).then(response => {
                    setNodes(response.nodes);
                    setPaths(response.paths);
                    setTitle(response.titleNode);
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
