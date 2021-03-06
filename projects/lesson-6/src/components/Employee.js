import React, { Component } from 'react'
import { Card, Col, Row, Layout, Alert, message, Button } from 'antd';

import Common from './Common';

class Employee extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const { payroll } = this.props;
        const updateInfo = (error, result) => {
            if (!error){
                this.checkEmployee();
            }
        }
        this.getPaidEvent = payroll.GetPaid(updateInfo);
        this.checkEmployee();
    }

    componentWillUnmount() {
        this.getPaidEvent.stopWatching();
    }

    checkEmployee = () => {
        const { payroll, account, web3 } = this.props;
        payroll.getEmployeeInfoById.call(account, {
            from: account,
            gas: 1000000
        }).then((result) => {
            //console.log(result)
            this.setState({
                salary: web3.fromWei(result[0].toNumber()),
                lastPaidDate: new Date(result[1].toNumber() * 1000).toString(),
                balance: web3.fromWei(result[2].toNumber())
            });
        }).catch((error) => {
			console.log(error);
		});
        //web3.eth.getBalance(account, (err, result) => {
        //    this.setState({
        //        balance: web3.fromWei(result[2].toNumber())
        //    });
        //});
    }

    getPaid = () => {
        const { payroll, account } = this.props;
        payroll.getPaid({
            from: account,
            gas: 1000000
        }).then((result) => {
            //alert('You have been paid');
			this.checkEmployee();
            message.info('You have been paid');
        }).catch((error) => {
			alert(error);
		});
    }

    renderContent() {
        const { salary, lastPaidDate, balance } = this.state;
        console.log('In renderContent');
        console.log(salary);
        console.log(lastPaidDate);
        console.log(balance);

        if (!salary || salary === '0') {
            return <Alert message="你不是员工" type="error" showIcon />;
        }

        return (
            <div>
                <Row gutter={16}>
                    <Col span={8}>
                        <Card title="薪水">{salary} Ether</Card>
                    </Col>
                    <Col span={8}>
                        <Card title="上次支付">{lastPaidDate}</Card>
                    </Col>
                    <Col span={8}>
                        <Card title="帐号金额">{balance} Ether</Card>
                    </Col>
                </Row>

                <Button
                    type="primary"
                    icon="bank"
                    onClick={this.getPaid}
                >
                    获得酬劳
                </Button>
            </div>
        );
    }

    render() {
        const { account, payroll, web3 } = this.props;
        console.log('In render');
        console.log(account);

        return (
            <Layout style={{ padding: '0 24px', background: '#fff' }}>
                <Common account={account} payroll={payroll} web3={web3} />
                <h2>Personal Info</h2>
                {this.renderContent()}
            </Layout>
        );
    }
}

export default Employee
