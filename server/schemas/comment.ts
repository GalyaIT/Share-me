export default{
    name: 'comment',
    title:'Comment',
    type:'document',
    fields:[
        {
            name:'postedBy',
            title:'PostedBy',
            type:'postedBy'
        },
        {
            name:'comment',
            title:'Comment',
            type:'string'
        }, 
        {
            name: 'publishedAt',
            title: 'Published at',
            type: 'datetime',
            options: {
                dateFormat: 'YYYY-MM-DD',
                calendarTodayLabel: 'Today'
              }
          },      
    ]
}