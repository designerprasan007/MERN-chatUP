import {useState, useEffect} from 'react';


import {useDispatch} from 'react-redux';
import moment from 'moment'

import './ChatBox.css';
import {LoadMoreMessge} from '../../../actions/MessageAction';


const ChatBox = ({message, socketmessage, presentUser, loginuser, friends, msgover}) =>{
    const dispatch = useDispatch();
    const [limits, setLimit] = useState({start:20, end:40}) 

    const dbmsg = message?.messages;

    useEffect(() =>{
      const messageArea = document.getElementById('msgarea');
      messageArea.scrollTop = messageArea.scrollHeight;
    }, [])

    const loadMessage = (e) =>{
      e.preventDefault();

      setLimit({...limits, start:limits.start + 20, end:limits.end + 20});
      const start = limits.start;
      const end = limits.end;
      const room = presentUser.room;
      dispatch(LoadMoreMessge(room, start, end));
      const messageArea = document.getElementById('msgarea');
      messageArea.scrollTop = messageArea.scrollHeight;
    }

   

     return(
      <>
    
        {msgover === undefined &&
          <button className="btn btn-sm btn-primary mt-3 loadBtn" onClick={(e) => loadMessage(e)}>load More</button>
         }
         <div id="msgarea">
          <ul className="list-group">
          { dbmsg?.length >= 1 ?  (
                dbmsg?.map((msg, key) =>
                    {
                        return(
                            <li key={key} className="list-group-item pr-3">
                                <div className={msg.receiver === loginuser ? 'text-right':'text-left'}>
                                    <span className={msg.receiver === loginuser ? 'friendMessage px-3 py-2':'myMessage px-3 py-2'}>{msg.message} 
                                    <span className="msgTime pl-3">{moment.utc(msg.created, 'X').format('hh:mm')}</span></span>
                                </div>
                              </li>
                              
                        )
                    })):(<p className="text-center pt-5">New Conversation</p>)}
                    { socketmessage?.length >= 1 ?  (
                      socketmessage?.map((msg, key) =>
                          {
                              return(
                                  <li key={key} className="list-group-item pr-3">
                                      <div className={msg.user === loginuser ? 'text-right':'text-left'}>
                                          <span className={msg.user === loginuser ? 'friendMessage px-3 py-2':'myMessage px-3 py-2'}>{msg.text} 
                                          <span className="msgTime pl-3">{moment.utc(msg.time, 'X').format('hh:mm')}</span></span>
                                      </div>
                                    </li>
                                    
                              )
                          })):('')
                  }
            </ul>
          </div>
        </>
    )
}


export default ChatBox;