import { Col, Row, Space, Button, Checkbox, Form, Input, Typography, Select, notification } from 'antd';

export default function notificationWithIcon(type, meessage, description) {
    notification[type]({
        message: meessage,
        description: description,

    });
};

