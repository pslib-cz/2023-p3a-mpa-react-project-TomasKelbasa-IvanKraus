export type TileType = {
    type: string, // A, B, C, ...
    imgname: string, // A.png, B.png, C.png, ...
    towns: TownType[], // towntype
    roads: RoadType[], // roadtype
    fields: FieldType[], // fieldtype
    monastery: boolean, // true if tile has a monastery
}

export type TownType = {
    sides: number[], // side of tile 1-4, 1 = bottom, 2 = left, 3 = top, 4 = right
    bonus: boolean, // true if town has a erb
}

export type RoadType = {
    sides: number[], // side of tile
}


/*
    bottom = 1
    bottom-left = 1,1
    bottom-right = 1,2
    left = 2
    left-left = 2,1
    left-right = 2,2
    top = 3
    top-left = 3,1
    top-right = 3,2
    right = 4
    right-left = 4,1
    right-right = 4,2
*/
export type FieldType = {
    sides: number[][], // [ [1,1], [1,2], [2,1], [2,2] ]...
}


export const tileTypes: TileType[] = [
    {
        type: "A",
        imgname: "A.png",
        towns: [],
        roads: [
            { sides: [1] },
        ],
        fields: [
            { 
                sides: [[1, 1], [1, 2], [2,1], [2,2], [3,1], [3,2], [4,1], [4,2]]
            },
        ],
        monastery: true,
    },
    {
        type: "B",
        imgname: "B.png",
        towns: [],
        roads: [
        ],
        fields: [
            { 
                sides: [[1, 1], [1, 2], [2,1], [2,2], [3,1], [3,2], [4,1], [4,2]]
            },
        ],
        monastery: true,
    },
    {
        type: "C",
        imgname: "C.png",
        towns: [{ sides: [1, 2, 3, 4], bonus: true }],
        roads: [
        ],
        fields: [
        ],
        monastery: false,
    },
    {
        type: "D",
        imgname: "D.png",
        towns: [{ sides: [3], bonus: false }],
        roads: [
            { sides: [2, 4] },
        ],
        fields: [
            { 
                sides: [
                    [1, 1], [1, 2], [2,1], [4,2]
                ]
            },
            {
                sides: [
                    [2,2], [4,1]
                ]
            }
        ],
        monastery: false,
    },
    {
        type: "E",
        imgname: "E.png",
        towns: [{ sides: [3], bonus: false }],
        roads: [
        ],
        fields: [
            { 
                sides: [
                    [1, 1], [1, 2], [2,1], [2,2], [4,1], [4,2]
                ]
            }
        ],
        monastery: false,
    },
    {
        type: "F",
        imgname: "F.png",
        towns: [{ sides: [2, 4], bonus: true }],
        roads: [
        ],
        fields: [
            { 
                sides: [
                    [1, 1], [1, 2]
                ]
            },
            {
                sides: [
                    [3,1], [3,2]
                ]
            }
        ],
        monastery: false,
    },
    {
        type: "G",
        imgname: "G.png",
        towns: [{ sides: [2, 4], bonus: false }],
        roads: [
        ],
        fields: [
            { 
                sides: [
                    [1, 1], [1, 2]
                ]
            },
            {
                sides: [
                    [3,1], [3,2]
                ]
            }
        ],
        monastery: false,
    },
    {
        type: "H",
        imgname: "H.png",
        towns: [{
             sides: [2], bonus: false },
             { sides: [4], bonus: false }
            ],
        roads: [
        ],
        fields: [
            { 
                sides: [
                    [1, 1], [1, 2], [3,1], [3,2]
                ]
            },
        ],
        monastery: false,
    },
    {
        type: "I",
        imgname: "I.png",
        towns: [{
             sides: [2, 3], bonus: false }
            ],
        roads: [
        ],
        fields: [
            { 
                sides: [
                    [1, 1], [1, 2], [4,1], [4,2]
                ]
            },
        ],
        monastery: false,
    },
    {
        type: "J",
        imgname: "J.png",
        towns: [{
             sides: [3], bonus: false }
            ],
        roads: [
            { sides: [1, 4] },
        ],
        fields: [
            { 
                sides: [
                    [1, 2], [2, 1], [2, 2], [4, 1]
                ]
            },
            {
                sides: [
                    [1, 1], [4, 2]
                ]
            }
        ],
        monastery: false,
    },
    {
        type: "K",
        imgname: "K.png",
        towns: [{
             sides: [3], bonus: false }
            ],
        roads: [
            { sides: [1, 2] },
        ],
        fields: [
            { 
                sides: [
                    [2, 2], [4, 1], [4, 2], [1, 1]
                ]
            },
            {
                sides: [
                    [1, 2], [2, 1]
                ]
            }
        ],
        monastery: false,
    },
    {
        type: "L",
        imgname: "L.png",
        towns: [{
             sides: [3], bonus: false }
            ],
        roads: [
            { sides: [1] },
            { sides: [4]},
            { sides: [2]}
        ],
        fields: [
            { 
                sides: [
                    [1, 2], [2, 1]
                ]
            },
            {
                sides: [
                    [2, 2], [4, 1]
                ]
            },
            {
                sides: [
                    [1, 1], [4, 2]
                ]
            }
        ],
        monastery: false,
    },
    {
        type: "M",
        imgname: "M.png",
        towns: [{
             sides: [2, 3], bonus: true }
            ],
        roads: [
        ],
        fields: [
            { 
                sides: [
                    [1, 1], [1, 2], [4,1], [4,2]
                ]
            },
        ],
        monastery: false,
    },
    {
        type: "N",
        imgname: "N.png",
        towns: [
            { sides: [3], bonus: false },
            { sides: [4], bonus: false }
            ],
        roads: [
        ],
        fields: [
            { 
                sides: [
                    [1, 1], [1, 2], [2,1], [2,2]
                ]
            },
        ],
        monastery: false,
    },
    {
        type: "O",
        imgname: "O.png",
        towns: [
            { sides: [2, 3], bonus: true }
            ],
        roads: [
            { sides: [1, 4] },
        ],
        fields: [
            { 
                sides: [
                    [1, 2], [4, 1]
                ]
            },
            {
                sides: [
                    [1, 1], [4, 2]
                ]
            }
        ],
        monastery: false,
    },
    {
        type: "P",
        imgname: "P.png",
        towns: [
            { sides: [2, 3], bonus: false }
            ],
        roads: [
            { sides: [1, 4] },
        ],
        fields: [
            { 
                sides: [
                    [1, 2], [4, 1]
                ]
            },
            {
                sides: [
                    [1, 1], [4, 2]
                ]
            }
        ],
        monastery: false,
    },
    {
        type: "Q",
        imgname: "Q.png",
        towns: [
            { sides: [2, 3, 4], bonus: true }
            ],
        roads: [
        ],
        fields: [
            { 
                sides: [
                    [1, 1], [1, 2]
                ]
            }
        ],
        monastery: false,
    },
    {
        type: "R",
        imgname: "R.png",
        towns: [
            { sides: [2, 3, 4], bonus: false }
            ],
        roads: [
        ],
        fields: [
            { 
                sides: [
                    [1, 1], [1, 2]
                ]
            }
        ],
        monastery: false,
    },
    {
        type: "S",
        imgname: "S.png",
        towns: [
            { sides: [2, 3, 4], bonus: true }
            ],
        roads: [
            { sides: [1] },
        ],
        fields: [
            { 
                sides: [
                    [1, 1]
                ]
            },
            {
                sides: [
                    [1, 2]
                ]
            }
        ],
        monastery: false,
    },
    {
        type: "T",
        imgname: "T.png",
        towns: [
            { sides: [2, 3, 4], bonus: false }
            ],
        roads: [
            { sides: [1] },
        ],
        fields: [
            { 
                sides: [
                    [1, 1]
                ]
            },
            {
                sides: [
                    [1, 2]
                ]
            }
        ],
        monastery: false,
    },
    {
        type: "U",
        imgname: "U.png",
        towns: [
            ],
        roads: [
            { sides: [1, 3] },
        ],
        fields: [
            { 
                sides: [
                    [1, 2], [2, 1], [2, 2], [3, 1]
                ]
            },
            {
                sides: [
                    [3, 2], [4, 1], [4, 2], [1, 1]
                ]
            }
        ],
        monastery: false,
    },
    {
        type: "V",
        imgname: "V.png",
        towns: [
            ],
        roads: [
            { sides: [1, 2] },
        ],
        fields: [
            { 
                sides: [
                    [1, 2], [2, 1]
                ]
            },
            {
                sides: [
                    [3, 2], [4, 1], [4, 2], [1, 1], [2, 2], [3, 1]
                ]
            }
        ],
        monastery: false,
    },
    {
        type: "W",
        imgname: "W.png",
        towns: [
            ],
        roads: [
            { sides: [1] },
            { sides: [4] },
            { sides: [2] },
        ],
        fields: [
            { 
                sides: [
                    [1, 2], [2, 1]
                ]
            },
            {
                sides: [
                    [2, 2], [3, 1], [3, 2], [4, 1]
                ]
            },
            {
                sides: [
                    [1, 1], [4, 2]
                ]
            }
        ],
        monastery: false,
    },
    {
        type: "X",
        imgname: "X.png",
        towns: [
            ],
        roads: [
            { sides: [1] },
            { sides: [4] },
            { sides: [2] },
            { sides: [3] },
        ],
        fields: [
            { 
                sides: [
                    [1, 2], [2, 1]
                ]
            },
            {
                sides: [
                    [2, 2], [3, 1]
                ]
            },
            {
                sides: [
                    [1, 1], [4, 2]
                ]
            },
            {
                sides: [
                    [3, 2], [4, 1]
                ]
                    
                
            }
        ],
        monastery: false,
    },
]

export const tilePayload = [
    /*
    { letter: "A", value: 2 },
    { letter: "B", value: 4 },
    { letter: "C", value: 1 },
    { letter: "D", value: 4 },
    { letter: "E", value: 5 },
    { letter: "F", value: 2 },
    { letter: "G", value: 1 },
    { letter: "H", value: 3 },
    { letter: "I", value: 2 },
    { letter: "J", value: 3 },
    { letter: "K", value: 3 },
    { letter: "L", value: 3 },
    { letter: "M", value: 2 },
    { letter: "N", value: 3 },
    { letter: "O", value: 2 },
    { letter: "P", value: 3 },
    { letter: "Q", value: 1 },
    { letter: "R", value: 3 },
    { letter: "S", value: 2 },
    { letter: "T", value: 1 },
    { letter: "U", value: 8 },
    { letter: "V", value: 9 },*/
    { letter: "W", value: 4 },
    { letter: "X", value: 1 }
];