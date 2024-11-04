// "use client";

// import { useState, useCallback, useMemo, useEffect } from "react";
// import ReactFlow, {
//   Node,
//   Edge,
//   Controls,
//   Background,
//   useNodesState,
//   useEdgesState,
//   addEdge,
//   MarkerType,
// } from "reactflow";
// import "reactflow/dist/style.css";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { NodeData } from "@/types/index";

// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Book, Code, FileVideo, Link } from "lucide-react";
// import { useParams } from "next/navigation";
// import { Models } from "appwrite";
// import { getRoadmapById } from "@/lib/appwrite/api";
// import Loader from "@/components/Loader";

// const nodeColor = (node: Node) => {
//   switch (node.type) {
//     case "input":
//       return "#6366f1";
//     case "default":
//       return "#22c55e";
//     case "output":
//       return "#ef4444";
//     default:
//       return "#64748b";
//   }
// };

// const ResourceIcon = ({ type }: { type: string }) => {
//   switch (type.toLowerCase()) {
//     case "article":
//       return <Book className="w-4 h-4" />;
//     case "video":
//       return <FileVideo className="w-4 h-4" />;
//     case "docs":
//       return <Code className="w-4 h-4" />;
//     default:
//       return <Link className="w-4 h-4" />;
//   }
// };

// export default function page() {
//   const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
//   const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
//   const { roadmapId } = useParams();
//   const [roadmapData, setRoadmapData] = useState<Models.Document | null>(null);
//   const [loading, setLoading] = useState(true);

//   const fetchRoadmap = useCallback(async (id: string) => {
//     setLoading(true);
//     try {
//       const fetchedRoadmap = await getRoadmapById(id);
//       setRoadmapData(fetchedRoadmap);
//     } catch (error) {
//       console.error("Error fetching roadmap:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (roadmapId) {
//       fetchRoadmap(roadmapId as string);
//     }
//   }, [roadmapId, fetchRoadmap]);

//   if (loading) {
//     return <Loader loading={loading} />;
//   }

//   const generateFlowData = useCallback(() => {
//     if (!roadmapData || !roadmapData.nodes)
//       return {
//         newNodes: [],
//         newEdges: [],
//       };

//     const newNodes: Node[] = roadmapData.nodes.map(
//       (node: any, index: number) => ({
//         id: node.nodeId,
//         type:
//           index === 0
//             ? "input"
//             : index === roadmapData.nodes.length - 1
//             ? "output"
//             : "default",
//         data: { label: node.title, ...node },
//         position: { x: 250 * (index % 3), y: 100 * Math.floor(index / 3) },
//       })
//     );

//     // Map newNodes to edges
//     //  Edge[] = []
//     const newEdges: Edge[] = newNodes.slice(0, -1).map((node, i) => ({
//       id: `e${node.id}-${newNodes[i + 1].id}`,
//       source: node.id,
//       target: newNodes[i + 1].id,
//       type: "smoothstep",
//       animated: true,
//       markerEnd: { type: MarkerType.ArrowClosed },
//     }));

//     // for (let i = 0; i < newNodes.length - 1; i++) {
//     //   newEdges.push({
//     //     id: `e${newNodes[i].id}-${newNodes[i + 1].id}`,
//     //     source: newNodes[i].id,
//     //     target: newNodes[i + 1].id,
//     //     type: "smoothstep",
//     //     animated: true,
//     //     markerEnd: {
//     //       type: MarkerType.ArrowClosed,
//     //     },
//     //   });
//     // }

//     // Use state setters outside of conditionals
//     // setNodes(newNodes);
//     // setEdges(newEdges);
//     return { newNodes, newEdges };
//   }, [roadmapData]);

//   useEffect(() => {
//     if (roadmapData?.title) {
//       const { newNodes, newEdges } = generateFlowData();
//       setNodes(newNodes);
//       setEdges(newEdges);
//     }
//   }, [generateFlowData, roadmapData, setNodes, setEdges]);

//   const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
//     setSelectedNode(node.data as NodeData);
//   }, []);

//   const onConnect = useCallback((params: any) => {
//     // if (roadmapData?.title) {
//     setEdges((eds) => addEdge(params, eds));
//     // }
//   }, []);

//   return (
//     <div className="w-full h-screen flex">
//       <div className="w-2/3 h-full">
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           onNodeClick={onNodeClick}
//           fitView
//           attributionPosition="bottom-left"
//         >
//           <Controls />
//           <Background color="#aaa" gap={16} />
//         </ReactFlow>
//       </div>
//       <div className="w-1/3 h-full p-4 bg-background border-l">
//         <Card className="h-full">
//           <CardHeader>
//             <CardTitle>{roadmapData?.title}</CardTitle>
//             <CardDescription>Click on a node to view details</CardDescription>
//           </CardHeader>
//           <CardContent>
//             {selectedNode ? (
//               <Tabs defaultValue="info" className="w-full">
//                 <TabsList className="grid w-full grid-cols-2">
//                   <TabsTrigger value="info">Info</TabsTrigger>
//                   <TabsTrigger value="resources">Resources</TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="info">
//                   <h3 className="text-lg font-semibold">
//                     {selectedNode.title}
//                   </h3>
//                   <p className="text-sm text-muted-foreground mt-2">
//                     {selectedNode.description}
//                   </p>
//                   {selectedNode.related_node.length > 0 && (
//                     <div className="mt-4">
//                       <h4 className="text-sm font-semibold">Related Topics:</h4>
//                       <ul className="list-disc list-inside mt-2">
//                         {selectedNode.related_node.map((related) => (
//                           <li key={related.nodeId} className="text-sm">
//                             {related.title}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                 </TabsContent>
//                 <TabsContent value="resources">
//                   <ScrollArea className="h-[calc(100vh-300px)]">
//                     {selectedNode.resources.map((resource, index) => (
//                       <Card key={index} className="mb-4">
//                         <CardHeader>
//                           <CardTitle className="text-base flex items-center gap-2">
//                             <ResourceIcon type={resource.type} />
//                             {resource.title}
//                           </CardTitle>
//                           <CardDescription className="text-xs">
//                             {resource.description}
//                           </CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="flex justify-between items-center">
//                             <Badge variant="secondary">
//                               {resource.difficulty}
//                             </Badge>
//                             <Button asChild size="sm">
//                               <a
//                                 href={resource.url}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                               >
//                                 Open Resource
//                               </a>
//                             </Button>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </ScrollArea>
//                 </TabsContent>
//               </Tabs>
//             ) : (
//               <p className="text-center text-muted-foreground">
//                 Select a node to view details
//               </p>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// =================================================

// "use client";

// import { useState, useCallback, useMemo } from "react";
// import { useParams } from "next/navigation";
// // import useSWR from "swr";
// import ReactFlow, {
//   Node,
//   Edge,
//   Controls,
//   Background,
//   useNodesState,
//   useEdgesState,
//   addEdge,
//   MarkerType,
// } from "reactflow";
// import "reactflow/dist/style.css";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Book, Code, FileVideo, Folder, LinkIcon, X } from "lucide-react";

// // const fetcher = (url) => fetch(url).then((res) => res.json());

// const exampleRoadmapData = {
//   roadmap_id: "fullstack",
//   title: "Fullstack Development",
//   description: "A comprehensive roadmap for fullstack development",
//   nodes: [
//     {
//       nodeId: "fullstack_node101",
//       title: "HTML & CSS",
//       description:
//         "HTML structures the webpage, and CSS styles it. These two are essential for building any web page.",
//       type: "checkpoint",
//       resources: [
//         {
//           title: "HTML Forms",
//           description:
//             "An HTML form is used to collect user input. The user input is most often sent to a server for processing.",
//           type: "article",
//           url: "https://www.w3schools.com/html/html_forms.asp",
//           difficulty: "Intermediate",
//         },
//         {
//           title: "HTML Basics Video",
//           description: "HTML Basics Video",
//           type: "video",
//           url: "https://www.youtube.com/watch?v=kUMe1FH4CHE",
//           difficulty: "easy",
//         },
//       ],
//     },
//     {
//       nodeId: "fullstack_node102",
//       title: "JavaScript",
//       description:
//         "JavaScript is the core scripting language of the web, allowing you to make your webpages interactive.",
//       type: "checkpoint",
//       resources: [
//         {
//           title: "JavaScript Introduction",
//           description: "JavaScript Introduction",
//           type: "article",
//           url: "https://www.w3schools.com/js/js_intro.asp",
//           difficulty: "Intermediate",
//         },
//       ],
//     },
//     {
//       nodeId: "fullstack_node103",
//       title: "Responsive Design & CSS Frameworks",
//       description:
//         "Learn to create responsive layouts and utilize CSS frameworks for efficient styling.",
//       type: "checkpoint",
//       resources: [
//         {
//           title: "Responsive design & CSS Frameworks",
//           description:
//             "Responsive web design (RWD) is a web design approach that renders web pages well on all screen sizes and resolutions while ensuring good usability.",
//           type: "article",
//           url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design",
//           difficulty: "Intermediate",
//         },
//       ],
//     },
//     {
//       nodeId: "fullstack_node104",
//       title: "Version Control (Git & GitHub)",
//       description:
//         "Learn to manage and track changes in your code using Git and collaborate using GitHub.",
//       type: "checkpoint",
//       resources: [
//         {
//           title: "Learn Git",
//           description: "Comprehensive guide to Git version control",
//           type: "docs",
//           url: "https://www.atlassian.com/git",
//           difficulty: "easy",
//         },
//       ],
//     },
//     {
//       nodeId: "fullstack_node105",
//       title: "JavaScript Advanced",
//       description:
//         "Dive deeper into JavaScript, exploring advanced concepts and modern features.",
//       type: "checkpoint",
//       resources: [
//         {
//           title: "Learn ES6 JavaScript",
//           description: "Modern JavaScript features and syntax",
//           type: "video",
//           url: "https://youtu.be/nZ1DMMsyVyI?si=K-gu3hNrCMzXI1a9",
//           difficulty: "Intermediate",
//         },
//       ],
//     },
//     {
//       nodeId: "fullstack_node106",
//       title: "Frontend Frameworks",
//       description:
//         "Explore popular frontend frameworks like React, Vue, or Angular.",
//       type: "checkpoint",
//       resources: [
//         {
//           title: "Learn Reactjs",
//           description: "Comprehensive React.js course",
//           type: "video",
//           url: "https://youtu.be/bMknfKXIFA8?si=omYli50Utm-3lemC",
//           difficulty: "easy",
//         },
//       ],
//     },
//   ],
// };

// const nodeWidth = 250;
// const nodeHeight = 80;

// function getResourceIcon(type: string) {
//   switch (type) {
//     case "article":
//       return <Book className="w-4 h-4" />;
//     case "video":
//       return <FileVideo className="w-4 h-4" />;
//     case "docs":
//       return <Folder className="w-4 h-4" />;
//     default:
//       return <Code className="w-4 h-4" />;
//   }
// }

// const ResourceCard = ({ resource }: any) => (
//   <Card className="mb-2">
//     <CardHeader className="p-4">
//       <CardTitle className="text-sm flex items-center gap-2">
//         {getResourceIcon(resource.type)}
//         {resource.title}
//       </CardTitle>
//     </CardHeader>
//     <CardContent className="p-4 pt-0">
//       <CardDescription className="text-xs">
//         {resource.description}
//       </CardDescription>
//       <div className="flex justify-between items-center mt-2">
//         <Badge variant="secondary" className="text-xs">
//           {resource.difficulty}
//         </Badge>
//         <Button variant="outline" size="sm" className="h-8" asChild>
//           <a href={resource.url} target="_blank" rel="noopener noreferrer">
//             <LinkIcon className="w-4 h-4 mr-2" />
//             Open
//           </a>
//         </Button>
//       </div>
//     </CardContent>
//   </Card>
// );

// const CustomNode = ({ data }: any) => (
//   <motion.div
//     initial={{ scale: 0.5, opacity: 0 }}
//     animate={{ scale: 1, opacity: 1 }}
//     transition={{ duration: 0.3 }}
//     className="bg-card text-card-foreground rounded-full border shadow-sm p-4 flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-md transition-shadow"
//     style={{ width: nodeWidth, height: nodeHeight }}
//   >
//     <h3 className="font-semibold text-sm">{data.title}</h3>
//   </motion.div>
// );

// export default function AnimatedRoadmap() {
//   const params = useParams();
//   // const { data: roadmapData, error } = useSWR(
//   //   params.roadmapId ? `/api/roadmaps/${params.roadmapId}` : null,
//   //   fetcher
//   // );

//   const [nodes, setNodes, onNodesChange] = useNodesState([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const [selectedNode, setSelectedNode] = useState<any>(null);

//   const onConnect = useCallback(
//     (params: any) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges]
//   );

//   const onNodeClick = useCallback(({ _, node }: any) => {
//     setSelectedNode(node);
//   }, []);

//   const nodeTypes = useMemo(() => ({ checkpoint: CustomNode }), []);

//   useMemo(() => {
//     if (exampleRoadmapData) {
//       // const data = roadmapData || exampleRoadmapData;
//       const data = exampleRoadmapData;
//       const newNodes: Node[] = data.nodes.map(({ node, index }: any) => ({
//         id: node?.nodeId,
//         data: { ...node },
//         position: { x: index % 2 === 0 ? 100 : 400, y: index * 200 },
//         type: "checkpoint",
//       }));

//       const newEdges: Edge[] = data.nodes
//         .slice(0, -1)
//         .map(({ node, index }: any) => ({
//           id: `e${node?.nodeId}-${data.nodes[index + 1]?.nodeId}`,
//           source: node?.nodeId,
//           target: data.nodes[index + 1]?.nodeId,
//           animated: true,
//           style: { stroke: "#6366f1", strokeWidth: 3 },
//           type: "smoothstep",
//           markerEnd: {
//             type: MarkerType.ArrowClosed,
//             color: "#6366f1",
//           },
//         }));

//       setNodes(newNodes);
//       setEdges(newEdges);
//     }
//   }, [setNodes, setEdges]);

//   // if (error) return <div>Failed to load roadmap</div>;
//   // if (!roadmapData && !error) return <div>Loading...</div>;

//   // const data = roadmapData || exampleRoadmapData;
//   const data = exampleRoadmapData;

//   return (
//     <div className="w-full h-screen flex flex-col md:flex-row">
//       <div className="flex-1 h-[70vh] md:h-full relative">
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           onNodeClick={onNodeClick}
//           nodeTypes={nodeTypes}
//           fitView
//           minZoom={0.5}
//           maxZoom={1.5}
//           attributionPosition="bottom-left"
//         >
//           <Background color="#6366f1" gap={16} />
//           <Controls />
//         </ReactFlow>
//       </div>
//       <AnimatePresence>
//         {selectedNode && (
//           <motion.div
//             initial={{ x: 300, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             exit={{ x: 300, opacity: 0 }}
//             transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             className="w-full md:w-96 bg-background border-t md:border-l p-4 overflow-auto relative"
//           >
//             <Button
//               variant="ghost"
//               size="icon"
//               className="absolute top-2 right-2"
//               onClick={() => setSelectedNode(null)}
//             >
//               <X className="h-4 w-4" />
//             </Button>
//             <h3 className="text-lg font-semibold mb-2">
//               {selectedNode.data.title}
//             </h3>
//             <p className="text-sm text-muted-foreground mb-4">
//               {selectedNode.data.description}
//             </p>
//             <h4 className="text-md font-semibold mb-2">Resources:</h4>
//             <ScrollArea className="h-[calc(100vh-200px)]">
//               {selectedNode.data.resources.map(({ resource, index }: any) => (
//                 <ResourceCard key={index} resource={resource} />
//               ))}
//             </ScrollArea>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion, AnimatePresence, animate } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, Code, FileVideo, Folder, LinkIcon, X } from "lucide-react";

const exampleRoadmapData = {
  roadmap_id: "fullstack",
  title: "Fullstack Development",
  description: "A comprehensive roadmap for fullstack development",
  nodes: [
    {
      nodeId: "fullstack_node101",
      title: "HTML & CSS",
      description: "HTML structures the webpage, and CSS styles it.",
      type: "checkpoint",
      resources: [
        {
          title: "HTML Forms",
          description: "An HTML form is used to collect user input.",
          type: "article",
          url: "https://www.w3schools.com/html/html_forms.asp",
          difficulty: "Intermediate",
        },
      ],
    },
    {
      nodeId: "fullstack_node102",
      title: "JavaScript",
      description: "JavaScript is the core scripting language of the web.",
      type: "checkpoint",
      resources: [
        {
          title: "JavaScript Introduction",
          description: "JavaScript Introduction",
          type: "article",
          url: "https://www.w3schools.com/js/js_intro.asp",
          difficulty: "Intermediate",
        },
      ],
    },
  ],
};

const nodeWidth = 250;
const nodeHeight = 80;

function getResourceIcon(type: string) {
  switch (type) {
    case "article":
      return <Book className="w-4 h-4" />;
    case "video":
      return <FileVideo className="w-4 h-4" />;
    case "docs":
      return <Folder className="w-4 h-4" />;
    default:
      return <Code className="w-4 h-4" />;
  }
}

const ResourceCard = ({ resource }: { resource: any }) => (
  <Card className="mb-2">
    <CardHeader className="p-4">
      <CardTitle className="text-sm flex items-center gap-2">
        {getResourceIcon(resource.type)}
        {resource.title}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4 pt-0">
      <CardDescription className="text-xs">
        {resource.description}
      </CardDescription>
      <div className="flex justify-between items-center mt-2">
        <Badge variant="secondary" className="text-xs">
          {resource.difficulty}
        </Badge>
        <Button variant="outline" size="sm" className="h-8" asChild>
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            <LinkIcon className="w-4 h-4 mr-2" />
            Open
          </a>
        </Button>
      </div>
    </CardContent>
  </Card>
);

const CustomNode = ({ data }: any) => (
  <motion.div
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="bg-card text-card-foreground rounded-full border shadow-sm p-4 flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-md transition-shadow"
    style={{ width: nodeWidth, height: nodeHeight }}
  >
    <h3 className="font-semibold text-sm">{data.title}</h3>
  </motion.div>
);

export default function AnimatedRoadmap() {
  const params = useParams();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            animated: true,
            style: { stroke: "#6366f1", strokeWidth: 3 },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const onNodeClick = useCallback((_: any, node: any) => {
    setSelectedNode(node);
  }, []);

  const nodeTypes = useMemo(() => ({ checkpoint: CustomNode }), []);

  useEffect(() => {
    if (exampleRoadmapData) {
      const data = exampleRoadmapData;
      const newNodes: Node[] = data.nodes.map((node, index) => ({
        id: node.nodeId,
        data: node,
        position: { x: index % 2 === 0 ? 100 : 400, y: index * 200 },
        type: "checkpoint",
      }));

      const newEdges: Edge[] = data.nodes.slice(0, -1).map((node, index) => ({
        id: `e${node.nodeId}-${data.nodes[index + 1].nodeId}`,
        source: node.nodeId,
        target: data.nodes[index + 1].nodeId,
        animated: true,
        style: { stroke: "#6366f1", strokeWidth: 3 },
        type: "smoothstep",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#6366f1",
        },
      }));

      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [setNodes, setEdges]);

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="flex-1 h-[70vh] md:h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.5}
          maxZoom={1.5}
          attributionPosition="bottom-left"
        >
          <Background color="#6366f1" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full md:w-96 bg-background border-t md:border-l p-4 overflow-auto relative"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setSelectedNode(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold mb-2">
              {selectedNode.data.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedNode.data.description}
            </p>
            <h4 className="text-md font-semibold mb-2">Resources:</h4>
            <ScrollArea className="h-[calc(100vh-200px)]">
              {selectedNode.data.resources.map(
                (resource: any, index: number) => (
                  <ResourceCard key={index} resource={resource} />
                )
              )}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
