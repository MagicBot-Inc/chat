import React, {useState,useEffect} from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import FixedLayout from "@vkontakte/vkui/dist/components/FixedLayout/FixedLayout";
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import List from '@vkontakte/vkui/dist/components/List/List';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';
import "./Style.css"
import bridge from '@vkontakte/vk-bridge';
import {Button,  usePlatform,IOS,Link,  PullToRefresh, View} from "@vkontakte/vkui";
import Icon36Replay from '@vkontakte/icons/dist/36/replay';
import Snackbar from "@vkontakte/vkui/dist/components/Snackbar/Snackbar";
import FormLayout from "@vkontakte/vkui/dist/components/FormLayout/FormLayout";
import Input from "@vkontakte/vkui/dist/components/Input/Input";
import Alert from "@vkontakte/vkui/dist/components/Alert/Alert";
import Placeholder from "@vkontakte/vkui/dist/components/Placeholder/Placeholder";
import Icon28MessagesOutline from '@vkontakte/icons/dist/28/messages_outline';



const Home = ({id,go,fetchedUser})=>{
		const [snackbar,setSnackBar] = useState(null);
        const [fetching,setFeatching] = useState(false);
        const [popout,setPopout] = useState(null);
        const [openAlert,setOpenAlert] = useState(0);
        const [DataMes,setDataMes] = useState(null);
        const [message,setMessage] = useState("");
        const [pGpG,setPost] = useState(0);
        const WRITE_MESSAGE_MODAL = "writeMessage";
        const platform = usePlatform();

        const RedBackground = {
             backgroundColor: 'var(--field_error_border)'
        };
        function handleChange(event) {
             setMessage(event.target.value);
        }
        useEffect(()=>{
            load_Mesages();
        },[]);

         function openError() {
             setPopout(
                 <Alert
                     actions={[{
                         title: 'Ок',
                         autoclose: true
                     }]}
                     onClose={()=>{setPopout(null)}}
                 >
                     <h2>Оплата невозможна</h2>
                     <p>На устройствах ios оплата невозможна.
                       Оплата сообщения доступна на платформе Android, а так же в браузерах.</p>
                 </Alert>
             )
        }

         async function WakeUpPay() {
            let a = pGpG*message.length;
            console.log(platform);
            if(platform !== IOS) {
                if (pGpG != 0)
                    bridge
                        .send("VKWebAppOpenPayForm", {
                            "app_id": 7307451, "action": "pay-to-group", "params": {
                                "amount": a,
                                "description": "Оплата_сообщения(не изменяйте данную строку) :" + message,
                                "data": {"test": "gg"},
                                "group_id": 191703970
                            }
                        })
                        .then(data => {
                            onRefresh();
                        })
                        .catch(error => {
                            console.log(error)
                        });
            }
            else
                openError();
        }
        function openDefault () {
            setPopout(
                <Alert
                    actions={[{
                        title: 'Ок',
                        autoclose: true,
                        action: () =>{setUser()},
                    }]}
                    onClose={()=>{setPopout(null)}}
                >
                    <h2>Уведомляем</h2>
                    <p>Оскорбления запрещаются, а ругательства осуждаются.
                        Каждый символ имеет ценность, учитывайте это при написании сообщения.
                        В чате отключены emoji</p>
                </Alert>
            );
        }
        function setUser() {
            load_Mesages();
            let link = 'https://iwinuxapp.ru/vkpay/PremiumChat/getting.php?method=setUser&vk_id='+fetchedUser.id;
            fetch(link, {
                method: 'GET',
            });
        }
        function getUser() {
            let link = 'https://iwinuxapp.ru/vkpay/PremiumChat/getting.php?method=getUser&vk_id='+fetchedUser.id;
            setOpenAlert(1);
            fetch(link, {
                    method: 'GET',
                })
            .then(res => res.json())
            .then((data) => {
                        setPost(data.pGpG);
                        if (data.user === 0) {
                            openDefault();
                        }
                    })
            .catch(console.log);

        }
        function OpenError (message) {
            if (snackbar) return;
            setSnackBar(
                    <Snackbar
                        layout="vertical"
                        onClose={() => {setSnackBar(null)}}
                        before={<Avatar size={24} style={RedBackground}><Icon24Dismiss fill="#fff" width={14} height={14} /></Avatar>}
                    >
                        {message}
                    </Snackbar>
            );
        }
        function convertTimestamp(timestamp) {
            var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
                yyyy = d.getFullYear(),
                mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
                dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
                hh = d.getHours(),
                h = hh,
                min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
                ampm = 'AM',
                time;

        if (hh > 12) {
            h = hh - 12;
            ampm = 'PM';
        } else if (hh === 12) {
            h = 12;
            ampm = 'PM';
        } else if (hh == 0) {
            h = 12;
        }

        // ie: 2013-02-18, 8:35 AM
        time = dd+ '.' + mm + '.' + yyyy  ;

        return time;
    }
        function load_Mesages() {
            setFeatching(true);
            fetch('https://iwinuxapp.ru/vkpay/PremiumChat/getting.php?method=getmessage', {
                method: 'GET',
            })
                .then(res => res.json())
                .then((data) => {setDataMes(data.list); setFeatching(false);})
                .catch(console.log);
        }
        function onRefresh() {
            setDataMes(null);
            setFeatching(true);
            load_Mesages();
        }
        function getSize(list) {
            let size = 0;
            DataMes.map(item=>{ size+=1;});
            return size;
        }

        return(
            <View popout={popout} activePanel='home' >
                <Panel id={id} >
                    <PanelHeader
                    left={<Button data-to='statistics' level="3" onClick={()=>{onRefresh()}}>
                        <Icon36Replay width={24} height={24} className="MyBlock"/></Button>}>
                        Premium Чат
                    </PanelHeader>
                    <PullToRefresh onRefresh={()=>onRefresh()} isFetching={fetching}>
                        <List style={{ paddingBottom:70, backgroundColor: "var(--background_page)"}}>
                            { DataMes == null ?
                               null :  getSize(DataMes.list) === 0 ?
                                    <Placeholder
                                    icon={<Icon28MessagesOutline className="MyBlock" />}
                                    header="Пока никто не написал  сообщений">
                                    Будьте первыми и напишите сообщение
                                </Placeholder> : DataMes.map(item=>
                                    <Group shadow={0} style={{padding:"0px",margin:"10px"}}  >
                                        <Link href={`https://vk.com/id${item.vk_id}`} target="_top" className="link" >
                                            <Div className="Profile">
                                                <Avatar  src={item.img} size={25}/>
                                                <p style={{marginLeft:"10px"}}>{`${item.name} `}</p>
                                                <p style={{color:"gray"}}> ● {convertTimestamp(item.date)}</p>
                                            </Div>
                                        </Link>
                                        <Div style={{paddingTop:"0px", marginLeft:"20px",paddingLeft:"0px",paddingRight:"0px" }}>
                                            {`${item.message}`}
                                        </Div>
                                    </Group>)
                            }
                        </List>
                    </PullToRefresh>
                    {fetchedUser != null ? openAlert===0 ? getUser():null :null}

                    <FixedLayout vertical="bottom" >
                        <Group >
                            <Div >
                                <FormLayout style={{padding:0}}>
                                <Input onChange={handleChange} top={`Сообщение ● стоимость - ${pGpG*message.length}`} type={"text"} hidden="Текст" />
                            </FormLayout>
                                <Button size="xl" onClick={()=>{
                                    if(message.length > 1){
                                        if(message.length < 250){
                                            WakeUpPay();
                                        }else{
                                            OpenError("Длина сообщения должна быть меньше 250 символов")
                                        }
                                    }else{
                                        OpenError("Длина сообщения минимум 2 символа")
                                    }
                                    // OpenError("Минимум должно быть 2 символа");
                                    // setModel('writeMessage');
                                }} data-to={WRITE_MESSAGE_MODAL}  level="commerce">
                                    Написать в чат
                                </Button>
                            </Div>
                        </Group>
                    </FixedLayout>
                    {snackbar}
                </Panel>
            </View>
		)
};

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
    fetchedUser: PropTypes.shape({
        photo_200: PropTypes.string,
        id: PropTypes.number,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        city: PropTypes.shape({
            title: PropTypes.string,
        }),
    }),
};



export default Home;
